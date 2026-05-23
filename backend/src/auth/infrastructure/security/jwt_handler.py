import os
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from loguru import logger

# Configuration from environment variables
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
try:
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
except (TypeError, ValueError):
    ACCESS_TOKEN_EXPIRE_MINUTES = 30

if not SECRET_KEY:
    logger.warning("SECRET_KEY environment variable is not set. Using a temporary key for local/testing purposes.")
    SECRET_KEY = "test_secret_key_change_me_in_production"

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """Create a signed JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> dict:
    """Decode a JWT access token.
    
    Raises:
        JWTError: If the token is invalid, expired, or signature verification fails.
    """
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
