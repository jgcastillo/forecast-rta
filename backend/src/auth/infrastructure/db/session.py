import os
from sqlmodel import create_engine, Session

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    # Set a fallback or raise an error. Since the app relies on DATABASE_URL, raising is appropriate.
    raise ValueError("DATABASE_URL environment variable is not set")

engine = create_engine(
    DATABASE_URL,
    # For PostgreSQL, we don't need check_same_thread, but if we fall back to SQLite for local development:
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

def get_session():
    """Dependency injection utility to yield a database session."""
    with Session(engine) as session:
        yield session
