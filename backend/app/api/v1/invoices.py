from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.invoice import InvoiceService
from app.schemas.invoice import Invoice

router = APIRouter()
invoice_service = InvoiceService()

@router.post("/upload", response_model=Invoice)
async def upload_invoice(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    # TODO: Add user authentication
    current_user_id: int = 1  # Temporary placeholder
):
    """Upload and process a new invoice"""
    # Validate file type
    if not file.content_type in ["application/pdf", "image/png"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF and PNG files are allowed"
        )
    
    # Create invoice record
    invoice = await invoice_service.create_invoice(db, current_user_id, file)
    
    # Process invoice asynchronously
    # TODO: In production, this should be handled by a background task
    await invoice_service.process_invoice(db, invoice.id)
    
    return invoice

@router.get("/list", response_model=List[Invoice])
async def list_invoices(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    # TODO: Add user authentication
    current_user_id: int = 1  # Temporary placeholder
):
    """Get list of user's invoices"""
    invoices = invoice_service.get_user_invoices(db, current_user_id, skip, limit)
    return invoices

@router.get("/{invoice_id}", response_model=Invoice)
async def get_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
    # TODO: Add user authentication
    current_user_id: int = 1  # Temporary placeholder
):
    """Get specific invoice details"""
    invoice = invoice_service.get_invoice(db, invoice_id)
    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invoice not found"
        )
    
    # TODO: Add permission check
    if invoice.user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this invoice"
        )
    
    return invoice 