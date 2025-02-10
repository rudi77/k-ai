from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import invoices, settings

app = FastAPI(title="Invoice Information Extraction API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(invoices.router, prefix="/api/v1/invoices", tags=["invoices"])
app.include_router(settings.router, prefix="/api/v1/settings", tags=["settings"])

@app.get("/health")
async def health_check():
    return {"status": "healthy"} 