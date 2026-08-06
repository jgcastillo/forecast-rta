# Implementation Plan: Modify Product UI (US-06)

**Branch**: `feature/catalog-us06-us07-management` | **Date**: 2026-08-06  
**Spec**: `.specify/modules/02_catalog/US06_modify_product/frontend/spec.md`

---

## Summary
Build the frontend slide-over edit drawer and custom React state hooks for updating existing product information. Connects to backend `PATCH /api/v1/products/{id}` using Axios network clients.

---

## Technical Context
- **Framework**: React 18+ (Vite)
- **Styling**: Tailwind CSS + Custom CSS Variables (Theme Compatible)
- **Icons & Typography**: Lucide React, Outfit display font
- **Testing**: Vitest + React Testing Library (TDD Workflow)

---

## Components & State Architecture

### 1. Network API Extension (`frontend/src/services/catalogApi.ts`)
Add method `updateProduct(id: string, payload: Partial<ProductUpdatePayload>): Promise<Product>`:
- Sends `PATCH` request to `/products/{id}`.

### 2. Custom React Hook (`frontend/src/hooks/useEditProduct.ts`)
Encapsulates state management and API communication:
- State: `formData`, `errors`, `isLoading`, `isSuccess`.
- Handlers: `handleInputChange`, `validateForm`, `submitUpdate`, `resetForm`.

### 3. Component Hierarchy
- `ProductEditDrawer.tsx`: Right-aligned drawer component with backdrop blur, glassmorphic header, form inputs, status toggle switch, cancel/save action buttons, and error toasts.

---

## Verification Plan

### Frontend Unit & Integration Tests (`frontend/src/__tests__/ProductEditDrawer.test.tsx`)
- Test drawer rendering with pre-populated product attributes.
- Test client-side validation error displays on bad input.
- Test successful submission, API call dispatch, and drawer close callback.
- Test network error handling (e.g. 409 duplicate code error display).
