from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from app.core.config import settings
from app.core.logging import setup_logging
from app.api.v1 import invoices, settings as settings_router

# Setup logging
logger = setup_logging()

app = FastAPI(title="Invoice Information Extraction API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger.info("Starting Invoice Information Extraction API")

# Include routers
app.include_router(invoices.router, prefix="/api/v1/invoices", tags=["invoices"])
app.include_router(settings_router.router, prefix="/api/v1/settings", tags=["settings"])

@app.get("/health")
async def health_check():
    logger.debug("Health check endpoint called")
    return {"status": "healthy"}

@app.on_event("startup")
async def startup_event():
    logger.info("Application startup complete")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Application shutdown") 