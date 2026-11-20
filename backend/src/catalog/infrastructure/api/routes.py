import math
from uuid import UUID
from decimal import Decimal
from fastapi import APIRouter, Depends, Security, HTTPException, status
from sqlmodel import Session, select, or_, func
from auth.infrastructure.db.session import get_session
from auth.infrastructure.api.dependencies import get_current_active_user
from auth.infrastructure.db.models_audit import AuditLog
from catalog.domain.models import Product
from catalog.infrastructure.api.schemas import (
    ProductCreate,
    ProductUpdate,
    ProductFilterParams,
    ProductResponse,
    PaginatedProductResponse
)

router = APIRouter(prefix="/products", tags=["Catalog"])

@router.post(
    "",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new product (Admin/Analyst only)"
)
def register_product(
    product_in: ProductCreate,
    session: Session = Depends(get_session),
    current_user = Security(get_current_active_user, scopes=["role:analyst"])
):
    """
    Register a new product in the catalog.
    If the product code already exists but is inactive, it will be reactivated and updated.
    If the product code exists and is active, a 409 Conflict is raised.
    Both the Product insertion and AuditLog record are committed atomically in a single transaction.
    """
    statement = select(Product).where(Product.code == product_in.code)
    existing_product = session.exec(statement).first()
    
    if existing_product:
        if not existing_product.is_active:
            # Reactivate soft-deleted product
            existing_product.description = product_in.description
            existing_product.qty_per_box = product_in.qty_per_box
            existing_product.exworks_price = product_in.exworks_price
            existing_product.series = product_in.series
            existing_product.shipping_route = product_in.shipping_route
            existing_product.is_active = True
            
            session.add(existing_product)
            
            audit_log = AuditLog(
                actor_id=current_user.id,
                target_id=existing_product.id,
                action="PRODUCT_REACTIVATED",
                details={
                    "code": existing_product.code,
                    "description": existing_product.description
                }
            )
            session.add(audit_log)
            session.commit()
            session.refresh(existing_product)
            return existing_product
        else:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Product with code '{product_in.code}' already exists."
            )
            
    # Create new product
    new_product = Product(
        code=product_in.code,
        description=product_in.description,
        qty_per_box=product_in.qty_per_box,
        exworks_price=product_in.exworks_price,
        series=product_in.series,
        shipping_route=product_in.shipping_route,
        is_active=True
    )
    session.add(new_product)
    session.flush()
    
    audit_log = AuditLog(
        actor_id=current_user.id,
        target_id=new_product.id,
        action="PRODUCT_CREATED",
        details={
            "code": new_product.code,
            "description": new_product.description
        }
    )
    session.add(audit_log)
    
    session.commit()
    session.refresh(new_product)
    return new_product


@router.get(
    "",
    response_model=PaginatedProductResponse,
    status_code=status.HTTP_200_OK,
    summary="List, search, filter, and paginate catalog products (Reviewer/Analyst/Admin)"
)
def get_products(
    params: ProductFilterParams = Depends(),
    session: Session = Depends(get_session),
    current_user = Security(get_current_active_user, scopes=["role:reviewer"])
):
    """
    Query product catalog with support for pagination, search, status filtering, and field sorting.
    """
    query = select(Product)

    if params.search:
        search_term = f"%{params.search.strip()}%"
        query = query.where(
            or_(
                Product.code.ilike(search_term),
                Product.description.ilike(search_term)
            )
        )
    if params.series:
        query = query.where(Product.series == params.series.strip())
    if params.shipping_route:
        query = query.where(Product.shipping_route == params.shipping_route.strip())
    if params.is_active is not None:
        query = query.where(Product.is_active == params.is_active)

    # Calculate total count matching filters
    count_query = select(func.count()).select_from(query.subquery())
    total = session.exec(count_query).one()

    # Dynamic sorting
    sort_attr = getattr(Product, params.sort_by, Product.code)
    if params.sort_order.lower() == "desc":
        query = query.order_by(sort_attr.desc())
    else:
        query = query.order_by(sort_attr.asc())

    # Pagination calculation
    offset = (params.page - 1) * params.page_size
    query = query.offset(offset).limit(params.page_size)

    items = session.exec(query).all()
    total_pages = math.ceil(total / params.page_size) if total > 0 else 0

    return PaginatedProductResponse(
        items=items,
        total=total,
        page=params.page,
        page_size=params.page_size,
        total_pages=total_pages
    )


@router.patch(
    "/{product_id}",
    response_model=ProductResponse,
    status_code=status.HTTP_200_OK,
    summary="Modify an existing product (Admin/Analyst only)"
)
def modify_product(
    product_id: UUID,
    product_in: ProductUpdate,
    session: Session = Depends(get_session),
    current_user = Security(get_current_active_user, scopes=["role:analyst"])
):
    """
    Partially update product details and log audit trail delta.
    """
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID '{product_id}' not found."
        )

    update_data = product_in.model_dump(exclude_unset=True)
    if not update_data:
        return product

    # Check code uniqueness if code is updated
    if "code" in update_data and update_data["code"] != product.code:
        statement = select(Product).where(Product.code == update_data["code"])
        existing = session.exec(statement).first()
        if existing and existing.id != product.id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Product with code '{update_data['code']}' already exists."
            )

    action = "PRODUCT_UPDATED"
    for field, value in update_data.items():
        if field == "is_active" and value is False and product.is_active is True:
            action = "PRODUCT_DEACTIVATED"
        setattr(product, field, value)

    session.add(product)

    # Format JSON-serializable audit log details
    audit_details = {}
    for k, v in update_data.items():
        if isinstance(v, Decimal):
            audit_details[k] = str(v)
        else:
            audit_details[k] = v

    audit_log = AuditLog(
        actor_id=current_user.id,
        target_id=product.id,
        action=action,
        details=audit_details
    )
    session.add(audit_log)

    session.commit()
    session.refresh(product)
    return product
