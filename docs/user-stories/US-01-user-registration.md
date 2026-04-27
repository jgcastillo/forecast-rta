# US-01 — User Registration

## User Story

**As an** Administrator,  
**I want to** register new users by providing their personal information and assigning a role,  
**So that** the system can grant secure access and track inventory actions.

---

## Acceptance Criteria

### AC-01: Successful user registration with all required fields

**Given** the Administrator provides all required fields:
- Full Name
- Unique Email
- Role (Admin, Analyst, or Reviewer)

**When** the create user command is executed,

**Then** the system must store a new user record with an "Active" status and return a success confirmation.

---

### AC-02: Registration fails when required fields are missing

**Given** the Administrator leaves any required field blank (Name, Email, or Role),

**When** the create user command is executed,

**Then** the system must reject the request and return an error message identifying the specific missing fields.

---

### AC-03: Registration fails with a duplicate email

**Given** an email already exists in the system database,

**When** the Administrator attempts to register a new user with that same email,

**Then** the system must block the registration and return an "Identity already exists" error.

---

## References

- FR-01: User Identity Management
- FR-02: Role-Based Access Control (RBAC)
- PRD Section 3: Stakeholders & Roles