# Specification: User Registration

**Feature Branch**: `001-user-registration`

## User Scenarios

### US-01: Success Registration
**Given** an admin provides Name, Email, and Role,  
**When** they submit the registration,  
**Then** the system creates the account and returns the user profile.

### US-02: Missing Fields
**Given** the admin leaves "Email" blank,  
**When** they submit,  
**Then** the system rejects the request with a "Missing field" error.

## Success Criteria
- **SC-01**: 100% of registrations result in a UUID-identified record.
- **SC-02**: Email uniqueness is guaranteed (zero duplicates).