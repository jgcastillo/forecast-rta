# Quickstart: User Registration

## 1. Run the Backend
```bash
docker-compose up -d db
uvicorn src.main:app --reload
```
## 2. Test Registration (cURL)
```bash
curl -X POST http://localhost:8000/api/v1/auth/users \
     -H "Content-Type: application/json" \
     -d '{"full_name": "Admin Test", "email": "admin@rta.com", "role": "admin"}'
```

## 3. Run Tests
```bash
pytest tests/
```



