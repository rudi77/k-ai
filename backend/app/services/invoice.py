from typing import List, Optional
from fastapi import UploadFile
import os
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.invoice import Invoice
from app.schemas.invoice import InvoiceCreate
from app.services.openai import OpenAIService
from app.core.config import settings

class InvoiceService:
    def __init__(self):
        self.openai_service = OpenAIService()

    async def create_invoice(
        self, 
        db: Session, 
        user_id: int, 
        file: UploadFile
    ) -> Invoice:
        # Create upload directory if it doesn't exist
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
        
        # Generate unique filename
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        file_extension = os.path.splitext(file.filename)[1]
        new_filename = f"{user_id}_{timestamp}{file_extension}"
        file_path = os.path.join(settings.UPLOAD_DIR, new_filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Create invoice record
        invoice_data = InvoiceCreate(
            original_filename=file.filename,
            file_path=file_path
        )
        
        db_invoice = Invoice(
            user_id=user_id,
            file_path=file_path,
            original_filename=file.filename,
            processing_status="pending"
        )
        db.add(db_invoice)
        db.commit()
        db.refresh(db_invoice)
        
        return db_invoice

    async def process_invoice(self, db: Session, invoice_id: int) -> Invoice:
        invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
        if not invoice:
            return None
            
        try:
            # Extract data using OpenAI
            extracted_data = await self.openai_service.extract_invoice_data(invoice.file_path)
            
            # Update invoice with extracted data
            invoice.extracted_data = extracted_data
            invoice.processing_status = "completed"
            db.commit()
            db.refresh(invoice)
            
        except Exception as e:
            invoice.processing_status = "failed"
            invoice.error_message = str(e)
            db.commit()
            db.refresh(invoice)
            
        return invoice

    def get_invoice(self, db: Session, invoice_id: int) -> Optional[Invoice]:
        return db.query(Invoice).filter(Invoice.id == invoice_id).first()

    def get_user_invoices(
        self, 
        db: Session, 
        user_id: int, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[Invoice]:
        return db.query(Invoice)\
            .filter(Invoice.user_id == user_id)\
            .order_by(Invoice.upload_date.desc())\
            .offset(skip)\
            .limit(limit)\
            .all() 