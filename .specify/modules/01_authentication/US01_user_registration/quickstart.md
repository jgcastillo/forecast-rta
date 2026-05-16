# Quickstart: User Registration & Authentication (US-01) - Docker Edition

This guide provides the steps to initialize the Authentication module and verify the User Registration flow using Docker and Docker Compose infrastructure.

## 1. Environment Setup

Ensure your `.env` file in the project root contains the necessary security variables. Note that `DATABASE_URL` uses the service name `db` (or as defined in your compose file):
```bash
# Security Configuration
SECRET_KEY=your_super_secret_key_for_jwt_signing
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database Configuration (Docker Internal Network)
DATABASE_URL=postgresql://user:password@db:5432/forecast_rta
```
## 2. Infrastructure Initialization

Build and start the containers:
```bash
# Start services in detached mode
docker compose up -d --build
```
Run the initial migrations to create the users and audit_logs tables within the running container:
# Execute migrations inside the backend container
```bash
docker compose exec backend alembic revision --autogenerate -m "create_auth_tables"
docker compose exec backend alembic upgrade head
```
## 3. Verifying the Registration Flow (TDD Approach)

To verify the implementation of UC-01 (User Registration), run the tests inside the container environment:
```bash
# Run integration tests inside the container
docker compose exec backend pytest tests/auth/integration/test_registration.py
```
### Manual Verification via Swagger UI

1. With the containers running, open your browser at `http://localhost:8000/docs`.
2. Locate the `POST /auth/register` endpoint.
3. Submit a JSON payload with an authorized Admin token:
   ```json
   {
     "first_name": "John",
     "last_name": "Doe",
     "email": "jdoe@rta.com",
     "password": "temporary_password_123",
     "role": "Analyst"
   }
   ```
4. Confirm the `201 Created` response containing the new user's details.

## 4. Obtaining an OAuth2 Access Token

To authenticate and obtain a JWT token for containerized requests:

1. Use the `/auth/token` (OAuth2 compatible) endpoint.
2. Provide `username` (email) and `password`.
3. The system returns a Bearer token with the assigned **Scopes** (e.g., `role:analyst`).

## 5. Audit Log Verification (Postgres Container)

After any registration, verify the record directly in the database container:
```bash
# Access the DB container and query audit logs
docker compose exec db psql -U user -d forecast_rta -c "SELECT * FROM audit_logs WHERE action = 'USER_REGISTRATION';"
```
## Troubleshooting

- **Container Logs**: Use `docker compose logs -f backend` to debug startup or connection issues.
- **DB Connectivity**: Ensure the `db` service is healthy before running migrations.
- **409 Conflict**: Email is already registered in the system.
- **401 Unauthorized**: The bearer token is missing, expired, or the Admin does not have the required scopes to create users.[cite: 1]
- **422 Unprocessable Entity**: Validation error (e.g., invalid email format or role not in [Admin, Analyst, Reviewer]).[cite: 1]
