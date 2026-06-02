from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session

from auth.infrastructure.api.routes import router as auth_router
from auth.infrastructure.api.errors import register_auth_exception_handlers
from auth.infrastructure.db.session import engine
from auth.infrastructure.db.seeding import seed_initial_admin

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event to manage database seeding and other startup/shutdown behaviors."""
    # Seed the initial admin account on startup
    with Session(engine) as session:
        seed_initial_admin(session)
    yield

app = FastAPI(
    title="Forecast RTA API",
    description="Automated Inventory Forecast and Management Monolith for RTA",
    version="0.1.0",
    lifespan=lifespan
)

# Enable CORS for local development and integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register custom exception handlers for the authentication module
register_auth_exception_handlers(app)

# Include routes with the correct api/v1 prefix
from auth.infrastructure.api.routes import router as auth_router, users_router
app.include_router(auth_router, prefix="/api/v1")
app.include_router(users_router, prefix="/api/v1")

@app.get("/health", tags=["Health"])
def health_check():
    """Service health check endpoint."""
    return {"status": "healthy"}
