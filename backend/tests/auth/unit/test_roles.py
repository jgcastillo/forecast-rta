import pytest
from auth.domain.models import UserRole
from auth.domain.roles import get_scope_for_role, get_allowed_scopes_for_role

def test_role_to_scope_mapping():
    """Verify that each role maps to its specific OAuth2 scope name."""
    assert get_scope_for_role(UserRole.ADMIN) == "role:admin"
    assert get_scope_for_role(UserRole.ANALYST) == "role:analyst"
    assert get_scope_for_role(UserRole.REVIEWER) == "role:reviewer"
    
    with pytest.raises(ValueError):
        get_scope_for_role("NotARole") # type: ignore

def test_allowed_scopes_hierarchy():
    """Verify the hierarchical scope access for roles."""
    admin_scopes = get_allowed_scopes_for_role(UserRole.ADMIN)
    assert "role:admin" in admin_scopes
    assert "role:analyst" in admin_scopes
    assert "role:reviewer" in admin_scopes
    
    analyst_scopes = get_allowed_scopes_for_role(UserRole.ANALYST)
    assert "role:admin" not in analyst_scopes
    assert "role:analyst" in analyst_scopes
    assert "role:reviewer" in analyst_scopes
    
    reviewer_scopes = get_allowed_scopes_for_role(UserRole.REVIEWER)
    assert "role:admin" not in reviewer_scopes
    assert "role:analyst" not in reviewer_scopes
    assert "role:reviewer" in reviewer_scopes
    
    with pytest.raises(ValueError):
        get_allowed_scopes_for_role("NotARole") # type: ignore
