import pytest
from datetime import timedelta, datetime, timezone
from jose import jwt
from auth.infrastructure.security.jwt_handler import create_access_token, decode_access_token, SECRET_KEY, ALGORITHM
from auth.infrastructure.security.hasher import hash_password, verify_password

def test_create_access_token():
    # Test creating a token with custom expiration
    data = {"sub": "test@example.com", "role": "Admin"}
    token = create_access_token(data=data, expires_delta=timedelta(minutes=10))
    
    decoded = decode_access_token(token)
    assert decoded["sub"] == "test@example.com"
    assert decoded["role"] == "Admin"
    assert "exp" in decoded

def test_create_access_token_default_expiration():
    data = {"sub": "user@example.com"}
    token = create_access_token(data=data)
    decoded = decode_access_token(token)
    assert decoded["sub"] == "user@example.com"
    assert "exp" in decoded

def test_decode_invalid_token():
    with pytest.raises(Exception):
        decode_access_token("invalid.token.signature")

def test_password_hashing_and_verification():
    password = "secure_password_123"
    hashed = hash_password(password)
    
    assert hashed != password
    assert verify_password(password, hashed) is True
    assert verify_password("wrong_password", hashed) is False
