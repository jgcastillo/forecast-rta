from fastapi import FastAPI
from auth.infrastructure.api.routes import router as auth_router
from auth.infrastructure.api.errors import register_auth_exception_handlers

app = FastAPI(
    title="Forecast RTA API",
    description="Automated Inventory Forecast and Management Monolith for RTA",
    version="0.1.0"
)

# Register custom exception handlers for the authentication module
register_auth_exception_handlers(app)

# Include routes
app.include_router(auth_router)

@app.get("/health", tags=["Health"])
def health_check():
    """Service health check endpoint."""
    return {"status": "healthy"}
