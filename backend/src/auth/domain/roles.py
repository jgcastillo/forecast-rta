from auth.domain.models import UserRole

# Define standard mapping of roles to primary scopes
ROLE_TO_SCOPE = {
    UserRole.ADMIN: "role:admin",
    UserRole.ANALYST: "role:analyst",
    UserRole.REVIEWER: "role:reviewer",
}

def get_scope_for_role(role: UserRole) -> str:
    """Get the specific primary scope corresponding to the user role."""
    try:
        # Cast to UserRole if it's a raw string
        enum_role = UserRole(role)
    except ValueError:
        raise ValueError(f"Invalid role: {role}")
    return ROLE_TO_SCOPE[enum_role]

def get_allowed_scopes_for_role(role: UserRole) -> list[str]:
    """Get all scopes that this user role is authorized for (hierarchical hierarchy)."""
    try:
        enum_role = UserRole(role)
    except ValueError:
        raise ValueError(f"Invalid role: {role}")
        
    if enum_role == UserRole.ADMIN:
        # Admins have full access permissions
        return ["role:admin", "role:analyst", "role:reviewer"]
    elif enum_role == UserRole.ANALYST:
        # Analysts can perform analyst and reviewer functions
        return ["role:analyst", "role:reviewer"]
    elif enum_role == UserRole.REVIEWER:
        # Reviewers have base read access only
        return ["role:reviewer"]
    else:
        raise ValueError(f"Unhandled role mapping: {role}")
