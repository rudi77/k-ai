from typing import List, Optional
from fastapi import UploadFile
import os
import logging
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.invoice import Invoice
from app.schemas.invoice import InvoiceCreate
from app.services.openai import OpenAIService
from app.core.config import settings

logger = logging.getLogger(__name__)

class InvoiceService:
    def __init__(self):
        self.openai_service = OpenAIService()
        logger.info("InvoiceService initialized")

    async def create_invoice(
        self, 
        db: Session, 
        user_id: int, 
        file: UploadFile
    ) -> Invoice:
        logger.info(f"Creating invoice for user {user_id} with file {file.filename}")
        
        try:
            # Create upload directory if it doesn't exist
            os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
            logger.debug(f"Ensured upload directory exists: {settings.UPLOAD_DIR}")
            
            # Generate unique filename
            timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
            file_extension = os.path.splitext(file.filename)[1]
            new_filename = f"{user_id}_{timestamp}{file_extension}"
            file_path = os.path.join(settings.UPLOAD_DIR, new_filename)
            logger.debug(f"Generated file path: {file_path}")
            
            # Save file
            with open(file_path, "wb") as buffer:
                content = await file.read()
                buffer.write(content)
            logger.info(f"Successfully saved file to {file_path}")
            
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
            logger.info(f"Successfully created invoice record with ID: {db_invoice.id}")
            
            return db_invoice
            
        except Exception as e:
            logger.error(f"Error creating invoice: {str(e)}", exc_info=True)
            raise

    async def process_invoice(self, db: Session, invoice_id: int) -> Invoice:
        logger.info(f"Processing invoice {invoice_id}")
        try:
            invoice = self.get_invoice(db, invoice_id)
            if not invoice:
                logger.error(f"Invoice {invoice_id} not found")
                raise ValueError(f"Invoice {invoice_id} not found")

            # Update status to processing
            invoice.processing_status = "processing"
            db.commit()
            logger.debug(f"Updated invoice {invoice_id} status to processing")

            # Process the invoice using OpenAI
            result = await self.openai_service.process_invoice(invoice.file_path)
            
            # Update invoice with results
            invoice.extracted_data = result
            invoice.processing_status = "completed"
            invoice.processed_at = datetime.utcnow()
            db.commit()
            logger.info(f"Successfully processed invoice {invoice_id}")
            
            return invoice
            
        except Exception as e:
            logger.error(f"Error processing invoice {invoice_id}: {str(e)}", exc_info=True)
            if invoice:
                invoice.processing_status = "failed"
                db.commit()
            raise

    def get_invoice(self, db: Session, invoice_id: int) -> Optional[Invoice]:
        logger.debug(f"Fetching invoice {invoice_id}")
        return db.query(Invoice).filter(Invoice.id == invoice_id).first()

    def get_user_invoices(
        self, 
        db: Session, 
        user_id: int, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[Invoice]:
        logger.debug(f"Fetching invoices for user {user_id} (skip={skip}, limit={limit})")
        invoices = db.query(Invoice).filter(
            Invoice.user_id == user_id
        ).offset(skip).limit(limit).all()
        logger.info(f"Found {len(invoices)} invoices for user {user_id}")
        return invoices 