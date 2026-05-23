from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth.infrastructure.api.routes import router as auth_router
from auth.infrastructure.api.errors import register_auth_exception_handlers

app = FastAPI(
    title="Forecast RTA API",
    description="Automated Inventory Forecast and Management Monolith for RTA",
    version="0.1.0"
)

# Enable CORS for local development and integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register custom exception handlers for the authentication module
register_auth_exception_handlers(app)

# Include routes with the correct api/v1 prefix
app.include_router(auth_router, prefix="/api/v1")

@app.get("/health", tags=["Health"])
def health_check():
    """Service health check endpoint."""
    return {"status": "healthy"}
