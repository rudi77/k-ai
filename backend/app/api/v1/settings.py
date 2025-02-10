from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.settings import SettingsService
from app.schemas.settings import SettingsResponse, SettingsUpdate

router = APIRouter()
settings_service = SettingsService()

@router.get("", response_model=SettingsResponse)
async def get_settings(
    db: Session = Depends(get_db),
    # TODO: Add user authentication
    current_user_id: int = 1  # Temporary placeholder
):
    """Get user settings"""
    user = settings_service.get_user_settings(db, current_user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return SettingsResponse.from_user(user)

@router.put("", response_model=SettingsResponse)
async def update_settings(
    settings: SettingsUpdate,
    db: Session = Depends(get_db),
    # TODO: Add user authentication
    current_user_id: int = 1  # Temporary placeholder
):
    """Update user settings"""
    user = settings_service.update_user_settings(db, current_user_id, settings)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return SettingsResponse.from_user(user) 