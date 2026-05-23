# Tasks Checklist: User Registration Frontend (US-01)

## Phase 1: Infrastructure & API Routing
- [ ] T015: Create the HTTP request/response types or interfaces representing `UserCreate` and `UserResponse` based on the OpenAPI schema.
- [ ] T016: Implement the API client function/service to send a POST request to `/auth/register`.
- [ ] T017: Ensure the API client relies on the global network layer that automatically appends the `Authorization: Bearer <token>` header.

## Phase 2: Application Logic & Validation
- [ ] T018: Implement client-side validation logic for input constraints (valid email format, password criteria, required text fields).
- [ ] T019: Create the custom state hook/controller to handle UI states: `idle`, `submitting`, `success`, and backend mapping errors.

## Phase 3: Component Presentation (UI)
- [ ] T020: Build the UI form elements matching the visual layout framework used in the project, setting inputs attributes properly (e.g., `type="email"`, `autocomplete="new-password"`).
- [ ] T021: Connect the form presentation elements to the state controller/hook created in T019.
- [ ] T022: Implement the feedback mechanism to display input validation errors inline and global errors via Toast messages.

## Phase 4: Integration & Verification
- [ ] T023: Inject the `UserRegistrationContainer` view into the private router layout, restricting access solely to users authenticated with the `Admin` role.
- [ ] T024: Run the frontend unit/component test suite to confirm all green paths and error validation messages work perfectly.