import os
from sqlmodel import Session, select, func
from auth.infrastructure.db.models import User
from auth.domain.models import UserRole
from auth.infrastructure.security.hasher import hash_password
from loguru import logger

def seed_initial_admin(session: Session):
    """Idempotently seed initial administrator, analyst, and reviewer users for development."""
    try:
        # Check if root admin exists
        admin_email = os.getenv("INITIAL_ADMIN_EMAIL", "admin@admin.com")
        admin_user = session.exec(select(User).where(User.email == admin_email)).first()
        
        if not admin_user:
            password = os.getenv("INITIAL_ADMIN_PASSWORD", "admin1234")
            admin_user = User(
                email=admin_email,
                first_name="Initial",
                last_name="Administrator",
                role=UserRole.ADMIN,
                hashed_password=hash_password(password),
                is_active=True
            )
            session.add(admin_user)
            logger.info(f"Seeded initial administrator: {admin_email}")

        # Seed initial analyst for dev simulation
        analyst_email = "analyst@admin.com"
        analyst_user = session.exec(select(User).where(User.email == analyst_email)).first()
        if not analyst_user:
            analyst_user = User(
                email=analyst_email,
                first_name="Supply",
                last_name="Analyst",
                role=UserRole.ANALYST,
                hashed_password=hash_password("analyst1234"),
                is_active=True
            )
            session.add(analyst_user)
            logger.info(f"Seeded initial analyst: {analyst_email}")

        # Seed initial reviewer for dev simulation
        reviewer_email = "reviewer@admin.com"
        reviewer_user = session.exec(select(User).where(User.email == reviewer_email)).first()
        if not reviewer_user:
            reviewer_user = User(
                email=reviewer_email,
                first_name="Demand",
                last_name="Reviewer",
                role=UserRole.REVIEWER,
                hashed_password=hash_password("reviewer1234"),
                is_active=True
            )
            session.add(reviewer_user)
            logger.info(f"Seeded initial reviewer: {reviewer_email}")

        session.commit()
    except Exception as e:
        session.rollback()
        logger.error(f"Failed to seed initial accounts: {e}")
        raise e
