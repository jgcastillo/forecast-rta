# Frontend Specification: User Registration UI (US-01)

**Feature**: 01-user-registration-ui  
**Module**: 01_authentication  
**Stack**: TypeScript / Component-Driven UI

---

## 1. UI Component Hierarchy

The registration interface is restricted to users with the `Admin` role. It consists of a secure view containing a structured form with immediate client-side feedback.

[Admin Dashboard Layout]
│
└── [UserRegistrationContainer]
│
├── [RegistrationForm]
│         ├── [InputField: email]
│         ├── [InputField: password]
│         ├── [InputField: first_name]
│         ├── [InputField: last_name]
│         └── [SelectField: role]
│
└── [FeedbackToastManager]


---

## 2. Interface Fields & Client-Side Invariants

The form MUST validate all fields locally before sending the payload to the `/auth/register` API endpoint, minimizing unnecessary network roundtrips.

| UI Field / Control | HTML Input Type | Client Validation Rules | UI Error State Behavior |
|---|---|---|---|
| **Email** | `type="email"` | Required, Must match standard email regex. | Displays "Please enter a valid corporate email" under the field. |
| **Password** | `type="password"` | Required, Min 8 chars, 1 alphanumeric, 1 number. | Dynamic strength indicator turns red/green. |
| **First Name** | `type="text"` | Required, max 100 characters, trimmed. | Standard error border if blank on blur. |
| **Last Name** | `type="text"` | Required, max 100 characters, trimmed. | Standard error border if blank on blur. |
| **Role Selection**| `select` | Required. Must default to `Reviewer`. | Options restricted to: Admin, Analyst, Reviewer. |

---

## 3. UI State Matrix & HTTP Handling

The component container must gracefully handle all potential asynchronous states returned by the backend adapter.

### 3.1 States
- **Idle**: Form is empty or pristine. Submit button is disabled until all HTML5/Pydantic-equivalent invariants pass.
- **Submitting**: Submit button changes to a loading spinner state. All input fields are set to `disabled` to prevent double-submission mutations.
- **Success Response (201 Created)**: 
  - Clear all form fields.
  - Trigger a green Success Toast notification: `"User [email] registered successfully."`
- **Error Responses**:
  - **401/403 (Unauthorized/Forbidden)**: Redirect to login or show interceptor modal: `"Session expired or insufficient permissions."`
  - **409 Conflict**: Set Email Input to error state and display: `"This email address is already in use."`
  - **422 Unprocessable Entity**: General fallback alert pointing to specific field errors sent by FastAPI.

---

## 4. Security & Storage Rules (Edge)

- **Token Interception**: The HTTP Client adapter MUST automatically inject the Admin's JWT token from secure application storage into the `Authorization: Bearer <token>` header.
- **Data Leakage Prevention**: Form state must reside in transient local component state.