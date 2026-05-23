# Infrastructure Specification: Database Viewer (Adminer)

**Feature**: infra-db-viewer  
**Module**: Infrastructure / Operations  
**Tool**: Adminer (Lightweight Database Management)

---

## 1. Docker Compose Integration Invariants

A new service named `db_viewer` MUST be appended to the root `docker-compose.yml` file.

- **Image**: `adminer:latest` (or official stable tag).
- **Network**: Must share the same network block as `forecast_db` to resolve the database container hostname internally.
- **Port Mapping**: Expose internal port `8080` to the host machine's port `8080` (or `8081` if `8080` is restricted).
- **Environment Dependency**: Explicitly include `depends_on` pointing to the `forecast_db` service to enforce correct startup order.

---

## 2. Connection Parameters (Default Screen Prefills)

To ease the developer login experience inside the web interface, the following default form attributes should be considered:
- **System**: PostgreSQL
- **Server (Host)**: `forecast_db` (The container name, not localhost)
- **User**: Read from `.env` (`POSTGRES_USER`)
- **Database**: Read from `.env` (`POSTGRES_DB`)