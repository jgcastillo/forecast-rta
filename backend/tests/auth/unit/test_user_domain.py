import pytest
from auth.domain.models import User, UserRole

def test_create_valid_user():
    """Verify that a user with valid fields can be successfully created."""
    user = User(
        email="john.doe@example.com",
        first_name="John",
        last_name="Doe",
        role=UserRole.ANALYST,
        hashed_password="hashedpassword123"
    )
    assert user.email == "john.doe@example.com"
    assert user.first_name == "John"
    assert user.last_name == "Doe"
    assert user.role == UserRole.ANALYST
    assert user.hashed_password == "hashedpassword123"
    assert user.is_active is True
    assert user.id is not None
    assert user.created_at is not None

def test_create_user_invalid_email():
    """Verify that creating a user with an invalid email format raises ValueError."""
    invalid_emails = [
        "plainaddress",
        "#@%^%#$@#$@#.com",
        "@example.com",
        "John Doe <email@example.com>",
        "email.example.com",
        "email@example@example.com",
    ]
    for email in invalid_emails:
        with pytest.raises(ValueError, match="Invalid email format"):
            User(
                email=email,
                first_name="John",
                last_name="Doe",
                role=UserRole.ANALYST,
                hashed_password="hashedpassword123"
            )

def test_create_user_empty_first_name():
    """Verify that creating a user with an empty/whitespace first name raises ValueError."""
    with pytest.raises(ValueError, match="First name is required"):
        User(
            email="john.doe@example.com",
            first_name="   ",
            last_name="Doe",
            role=UserRole.ANALYST,
            hashed_password="hashedpassword123"
        )

def test_create_user_empty_last_name():
    """Verify that creating a user with an empty/whitespace last name raises ValueError."""
    with pytest.raises(ValueError, match="Last name is required"):
        User(
            email="john.doe@example.com",
            first_name="John",
            last_name="",
            role=UserRole.ANALYST,
            hashed_password="hashedpassword123"
        )

def test_create_user_invalid_role():
    """Verify that creating a user with an invalid role raises ValueError."""
    with pytest.raises(ValueError, match="Invalid role assigned"):
        User(
            email="john.doe@example.com",
            first_name="John",
            last_name="Doe",
            role="NotARole",  # type: ignore
            hashed_password="hashedpassword123"
        )
