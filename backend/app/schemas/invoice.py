from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class InvoiceBase(BaseModel):
    pass

class InvoiceCreate(InvoiceBase):
    original_filename: str
    file_path: str

class InvoiceUpdate(InvoiceBase):
    extracted_data: Optional[Dict[str, Any]] = None
    processing_status: Optional[str] = None
    error_message: Optional[str] = None

class InvoiceInDBBase(InvoiceBase):
    id: int
    user_id: int
    file_path: str
    original_filename: str
    extracted_data: Optional[Dict[str, Any]] = None
    processing_status: str
    error_message: Optional[str] = None
    upload_date: datetime

    class Config:
        from_attributes = True

class Invoice(InvoiceInDBBase):
    pass 