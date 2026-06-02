# Tasks: Password Reset UI (US-04)

## Phase 1: Infrastructure
- [x] T055 [P] Add `requestPasswordRecovery` and `resetPassword` methods to `frontend/src/infrastructure/api/client.ts`
- [x] T056 [P] Register `/forgot-password` and `/reset-password` routes in `App.tsx`

## Phase 2: Implementation (Anti-AI Slop Principles)
- [x] T057 [US1] Build `ForgotPasswordView` with clean form and success state.
- [x] T058 [US2] Build `ResetPasswordView` using `useSearchParams` to extract token.
- [x] T059 [US2] Integrate form validation (matching passwords) and handle API error states.
- [x] T060 [P] Ensure UI components are responsive and adapt to Light/Dark mode via CSS Variables.