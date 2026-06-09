import pytest
from loguru import logger
from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy.pool import StaticPool

# Import all database models here to register them with SQLModel.metadata
from auth.infrastructure.db.models import User
from auth.infrastructure.db.models_audit import AuditLog
from catalog.domain.models import Product

# Configure Loguru for testing to avoid cluttering test output while retaining warning/error logs
@pytest.fixture(autouse=True)
def configure_logging():
    """Configure loguru for testing."""
    logger.remove()
    logger.add(
        sink=lambda msg: print(msg, end=""),
        level="WARNING",
        format="<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>"
    )

@pytest.fixture(name="engine", scope="session")
def test_engine():
    """Create an in-memory SQLite database engine for testing."""
    # SQLite URL for in-memory DB
    sqlite_url = "sqlite:///:memory:"
    engine = create_engine(
        sqlite_url,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    yield engine

@pytest.fixture(name="db_session")
def test_session(engine):
    """Create a clean, isolated database session for each test, yielding a fresh database state."""
    # Create the database tables
    SQLModel.metadata.create_all(engine)
    
    with Session(engine) as session:
        yield session
        
    # Clean up / drop the database tables after the test
    SQLModel.metadata.drop_all(engine)
