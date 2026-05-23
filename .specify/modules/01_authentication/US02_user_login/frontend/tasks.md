# Tasks Checklist: User Login Frontend (US-02)

## Phase 1: Authentication Network Layer
- [x] T031: Create API interface for the urlencoded body format matching OAuth2 specifications.
- [x] T032: Build the API client call to POST `/api/v1/auth/login`.
- [x] T033: Update the network infrastructure client interceptor to fetch the token from local storage and inject it seamlessly into headers.

## Phase 2: Form Presentation & Routing
- [x] T034: Create the controlled `LoginForm` component with basic email and password client side requirements.
- [x] T035: Bind the login execution state to global React Context storage.
- [x] T036: Implement private route guards so unauthenticated navigation to user registration redirects immediately to `/login`.