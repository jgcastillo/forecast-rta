# Tasks: Modify Product UI (US-06)

## Phase 2: Foundational (API Client & Types)
- [x] T075 [US-06] Add `updateProduct` network contract to `catalogApi` and declare `ProductUpdatePayload` interface in frontend types.

## Phase 3: User Story 1 - Product Edit Slide-Over / Modal Panel (Priority: P1)
- [x] T076 [P] [US1] Write failing Vitest component tests for product edit drawer pre-population and submission in `frontend/src/presentation/components/EditProductSlideOver.test.tsx`.
- [x] T077 [US1] Create custom state hook `useEditProduct.ts` managing validation logic, field mutations, and API requests.
- [x] T078 [US1] Build `EditProductSlideOver.tsx` slide-over view following Anti-AI Slop design rules (Outfit typography, glassmorphism backdrop, theme compatibility).

## Phase 4: User Story 2 - Product Status Toggle & Deactivation (Priority: P2)
- [x] T079 [P] [US2] Write component tests for status toggle switch interactions in product edit drawer.
- [x] T080 [US2] Implement active/inactive status switch control in `EditProductSlideOver.tsx` updating soft-delete state.
