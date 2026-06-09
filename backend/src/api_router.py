from fastapi import APIRouter
from auth.infrastructure.api.routes import router as auth_router, users_router
from catalog.infrastructure.api.routes import router as catalog_router

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(catalog_router)
