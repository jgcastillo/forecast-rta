from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session


from auth.infrastructure.api.errors import register_auth_exception_handlers
from auth.infrastructure.db.session import engine
from auth.infrastructure.db.seeding import seed_initial_admin

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event to manage database seeding and other startup/shutdown behaviors."""
    # Seed initial accounts on startup
    with Session(engine) as session:
        seed_initial_admin(session)
    yield

app = FastAPI(
    title="Forecast RTA API",
    description="Automated Inventory Forecast and Management Monolith for RTA",
    version="0.1.0",
    lifespan=lifespan
)

# Enable CORS for local development, docker bridges, and integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    # Expanded regex to allow localhost, 127.0.0.1 and any private IP network (172.x.x.x, 192.168.x.x, 10.x.x.x)
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1|172\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register custom exception handlers for the authentication module
register_auth_exception_handlers(app)

# Include routes with the correct api/v1 prefix
from api_router import api_router
app.include_router(api_router)

@app.get("/health", tags=["Health"])
def health_check():
    """Service health check endpoint."""
    return {"status": "healthy"}
