---
name: tdd-implementation
description: Implements approved forecast_rta production behavior using Red-Green-Refactor and the approved spec, plan, and tasks. Use when implementing or modifying application behavior, domain logic, APIs, adapters, or frontend behavior.
---

# TDD Implementation

## Goal

Implement approved behavior through test-first development without expanding scope.

## Procedure

For each independent behavior:

1. Identify the governing task and related BR / FR / AC / INV identifiers.
2. Inspect existing implementation and tests.
3. Write or modify the smallest relevant test.
4. Run it and confirm it fails for the expected reason.
5. Implement the minimum production change.
6. Run the test and confirm it passes.
7. Run affected regression tests.
8. Refactor only while tests remain green.
9. Continue with the next behavior.

For core business logic prefer:

`Domain test -> Domain -> Application test -> Application -> Adapter test -> Infrastructure -> API/UI`

## Stop Conditions

Stop and report if:

- expected behavior is ambiguous;
- a governing rule conflicts with implementation;
- the test cannot be derived from approved behavior;
- required architecture would contradict an accepted ADR;
- the task requires unapproved scope.

## Constraints

- Do not implement behavior before its relevant failing test.
- Do not invent business rules.
- Do not move domain logic into controllers or presentation components.
- Do not modify golden expected results merely to make tests pass.
- Do not perform unrelated refactors.