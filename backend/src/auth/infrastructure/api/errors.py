from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from loguru import logger

class AuthError(Exception):
    """Base exception for all authentication/authorization errors."""
    def __init__(self, message: str):
        self.message = message
        super().__init__(message)

class ConflictError(AuthError):
    """Exception raised when a resource conflict occurs (e.g. email already registered)."""
    pass

class UnauthorizedError(AuthError):
    """Exception raised when authentication fails or credentials are invalid."""
    pass

class ForbiddenError(AuthError):
    """Exception raised when a user has insufficient permissions."""
    pass

class InvalidInputError(AuthError):
    """Exception raised when input validation fails."""
    pass

def register_auth_exception_handlers(app: FastAPI) -> None:
    """Register custom exception handlers for the Auth module on the FastAPI app."""
    
    @app.exception_handler(ConflictError)
    async def conflict_exception_handler(request: Request, exc: ConflictError):
        logger.warning(f"Conflict error: {exc.message}")
        return JSONResponse(
            status_code=409,
            content={"detail": exc.message}
        )
        
    @app.exception_handler(UnauthorizedError)
    async def unauthorized_exception_handler(request: Request, exc: UnauthorizedError):
        logger.warning(f"Unauthorized error: {exc.message}")
        return JSONResponse(
            status_code=401,
            headers={"WWW-Authenticate": "Bearer"},
            content={"detail": exc.message}
        )
        
    @app.exception_handler(ForbiddenError)
    async def forbidden_exception_handler(request: Request, exc: ForbiddenError):
        logger.warning(f"Forbidden error: {exc.message}")
        return JSONResponse(
            status_code=403,
            content={"detail": exc.message}
        )
        
    @app.exception_handler(InvalidInputError)
    async def invalid_input_exception_handler(request: Request, exc: InvalidInputError):
        logger.warning(f"Invalid input: {exc.message}")
        return JSONResponse(
            status_code=422,
            content={"detail": exc.message}
        )

    @app.exception_handler(ValueError)
    async def value_error_exception_handler(request: Request, exc: ValueError):
        # Translate domain-level ValueError to 422 Unprocessable Entity
        logger.warning(f"Value/Validation error: {str(exc)}")
        return JSONResponse(
            status_code=422,
            content={"detail": str(exc)}
        )
