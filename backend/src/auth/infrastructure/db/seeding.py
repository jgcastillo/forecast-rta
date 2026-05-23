import os
from sqlmodel import Session, select, func
from auth.infrastructure.db.models import User
from auth.domain.models import UserRole
from auth.infrastructure.security.hasher import hash_password
from loguru import logger

def seed_initial_admin(session: Session):
    """Idempotently seed the initial root administrator if no users exist in the database."""
    try:
        count = session.exec(select(func.count(User.id))).one()
        if count == 0:
            email = os.getenv("INITIAL_ADMIN_EMAIL", "admin@admin.com")
            password = os.getenv("INITIAL_ADMIN_PASSWORD", "admin1234")
            role_str = os.getenv("INITIAL_ADMIN_ROLE", "Admin")
            
            try:
                role = UserRole(role_str)
            except ValueError:
                logger.warning(f"Invalid INITIAL_ADMIN_ROLE value '{role_str}'. Defaulting to Admin.")
                role = UserRole.ADMIN
                
            hashed = hash_password(password)
            admin_user = User(
                email=email,
                first_name="Initial",
                last_name="Administrator",
                role=role,
                hashed_password=hashed,
                is_active=True
            )
            session.add(admin_user)
            session.commit()
            logger.info(f"Successfully seeded initial administrator: {email} with role {role.value}")
        else:
            logger.info("Database already seeded. Skipping initial administrator provisioning.")
    except Exception as e:
        session.rollback()
        logger.error(f"Failed to seed initial administrator: {e}")
        raise e
