from typing import List
import logging
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.invoice import InvoiceService
from app.schemas.invoice import Invoice

logger = logging.getLogger(__name__)

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
    logger.info(f"Received invoice upload request from user {current_user_id}")
    logger.debug(f"File details - filename: {file.filename}, content_type: {file.content_type}")

    # Validate file type
    if not file.content_type in ["application/pdf", "image/png"]:
        logger.warning(f"Invalid file type attempted: {file.content_type}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF and PNG files are allowed"
        )
    
    try:
        # Create invoice record
        logger.debug("Creating invoice record")
        invoice = await invoice_service.create_invoice(db, current_user_id, file)
        
        # Process invoice asynchronously
        # TODO: In production, this should be handled by a background task
        logger.debug(f"Processing invoice {invoice.id}")
        await invoice_service.process_invoice(db, invoice.id)
        
        logger.info(f"Successfully processed invoice {invoice.id} for user {current_user_id}")
        return invoice
    except Exception as e:
        logger.error(f"Error processing invoice upload: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error processing invoice"
        )

@router.get("/list", response_model=List[Invoice])
async def list_invoices(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    # TODO: Add user authentication
    current_user_id: int = 1  # Temporary placeholder
):
    """Get list of user's invoices"""
    logger.info(f"Fetching invoices for user {current_user_id}")
    logger.debug(f"List parameters - skip: {skip}, limit: {limit}")
    
    try:
        invoices = invoice_service.get_user_invoices(db, current_user_id, skip, limit)
        logger.info(f"Successfully retrieved {len(invoices)} invoices for user {current_user_id}")
        return invoices
    except Exception as e:
        logger.error(f"Error fetching invoices: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching invoices"
        )

@router.get("/{invoice_id}", response_model=Invoice)
async def get_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
    # TODO: Add user authentication
    current_user_id: int = 1  # Temporary placeholder
):
    """Get specific invoice by ID"""
    logger.info(f"Fetching invoice {invoice_id} for user {current_user_id}")
    
    try:
        invoice = invoice_service.get_invoice(db, invoice_id)
        if not invoice:
            logger.warning(f"Invoice {invoice_id} not found")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Invoice not found"
            )
        
        # TODO: Add authorization check
        if invoice.user_id != current_user_id:
            logger.warning(f"User {current_user_id} attempted to access invoice {invoice_id} belonging to user {invoice.user_id}")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access this invoice"
            )
        
        logger.info(f"Successfully retrieved invoice {invoice_id}")
        return invoice
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching invoice {invoice_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching invoice"
        ) 