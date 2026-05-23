# Forecast RTA - Architecture & Authentication Infrastructure

Welcome to **Forecast RTA**, a modular monolith system designed for real-time analysis and forecasting. This repository houses the complete backend and frontend services containerized with Docker.

---

## 🚀 Getting Started

### 1. Environment Configuration

Create a `.env` file in the root directory based on the following template:

```bash
# Database Configuration (PostgreSQL)
DB_USER=rta_admin
DB_PASSWORD=rta_secure_pass
DB_NAME=forecast_rta

# Security / JWT Configuration
SECRET_KEY=foundation_secret_key_2026
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 2. Launching Infrastructure

Start the PostgreSQL, FastAPI backend, and React/Vite frontend services:

```bash
# Build and run containers in background
docker compose up -d --build
```

---

## 🗄️ Database Migrations (Alembic)

Database schema updates are managed with Alembic inside the `api` container. 

To apply the initial migrations and create the tables for the Authentication module:

```bash
# Run migration scripts to create tables (users, audit_logs)
docker compose exec api alembic upgrade head
```

---

## 🧪 Running Tests (TDD Verification)

Unit and integration test suites are written using `pytest`. Run them inside the api container:

```bash
# Run all unit and integration tests
docker compose exec api pytest
```

---

## 🔐 Authentication Module API Documentation

The authentication service implements **OAuth2 with Password Flow** and stateless **JWT Bearer tokens**.

### 1. Register a User (Administrator Only)
* **Endpoint:** `POST /auth/register`
* **Access:** Restricted to users with the `Admin` role.
* **Request Body:**
  ```json
  {
    "email": "analyst.user@rta.com",
    "first_name": "Jane",
    "last_name": "Doe",
    "role": "Analyst",
    "password": "securepassword123"
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "id": "161031be-4b2a-4dfa-bd5b-b998cf28e12c",
    "email": "analyst.user@rta.com",
    "first_name": "Jane",
    "last_name": "Doe",
    "role": "Analyst",
    "is_active": true,
    "created_at": "2026-05-23T17:24:15.271Z"
  }
  ```

### 2. Login & Token Retrieval
* **Endpoint:** `POST /auth/token`
* **Form Parameters:**
  * `username`: (email address)
  * `password`: (plain password)
* **Response (200 OK):**
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer"
  }
  ```

---

## 🛡️ Role-Based Access Control (RBAC)

The system handles granular user permissions using **OAuth2 Scopes** embedded in the JWT:

| Role | Primary Scope | Authorized Hierarchical Scopes |
| :--- | :--- | :--- |
| **Admin** | `role:admin` | `role:admin`, `role:analyst`, `role:reviewer` |
| **Analyst** | `role:analyst` | `role:analyst`, `role:reviewer` |
| **Reviewer** | `role:reviewer` | `role:reviewer` |

### Scope Protection Checkpoints
Endpoints can restrict access to specific scopes by injecting FastAPI's `Security` dependency:

* `/auth/test-analyst`: Requires `role:analyst`. Accessible by **Admin** and **Analyst**.
* `/auth/test-reviewer`: Requires `role:reviewer`. Accessible by **Admin**, **Analyst**, and **Reviewer**.
