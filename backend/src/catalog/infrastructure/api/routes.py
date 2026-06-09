from fastapi import APIRouter, Depends, Security, HTTPException, status
from sqlmodel import Session, select
from auth.infrastructure.db.session import get_session
from auth.infrastructure.api.dependencies import get_current_active_user
from auth.infrastructure.db.models_audit import AuditLog
from catalog.domain.models import Product
from catalog.infrastructure.api.schemas import ProductCreate, ProductResponse

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
    # Look up product by code to check duplicates early (both active and inactive)
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
    
    # Flush to generate new_product.id
    session.flush()
    
    # Create AuditLog entry in the same transaction block
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
    
    # Commit atomically
    session.commit()
    session.refresh(new_product)
    return new_product
