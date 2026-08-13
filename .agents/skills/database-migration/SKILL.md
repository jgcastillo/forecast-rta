---
name: database-migration
description: Safely performs forecast_rta SQLModel and Alembic schema changes derived from an approved data model or implementation plan. Use whenever a task adds, removes, renames, or changes persistent database structures.
---

# Database Migration

## Goal

Apply approved persistence changes safely and without allowing the database schema to invent domain behavior.

## Procedure

1. Confirm the schema change exists in the approved plan or data model.
2. Inspect current SQLModel models and relevant migrations.
3. Add or update the required persistence tests first when behavior is affected.
4. Modify only required persistence structures.
5. Generate the Alembic migration.
6. Inspect the migration manually for:
   - unintended tables or columns;
   - accidental drops;
   - incorrect nullability;
   - incorrect constraints;
   - unsafe data transformations.
7. Apply the migration in the Docker development environment.
8. Run relevant persistence/integration tests.
9. Verify downgrade behavior when required by the approved plan.

## Constraints

- Do not create speculative fields or tables.
- Do not infer business semantics from database convenience.
- Do not modify core domain models solely to mirror SQLModel.
- Do not use production data or production databases for automated verification.
- Stop if existing data requires a migration policy not covered by the approved plan.