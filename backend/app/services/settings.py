from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.settings import SettingsUpdate
from app.core.encryption import EncryptionService

class SettingsService:
    def __init__(self):
        self.encryption = EncryptionService()

    def get_user_settings(self, db: Session, user_id: int) -> User:
        user = db.query(User).filter(User.id == user_id).first()
        if user and user.api_key:
            # Decrypt API key before using it
            user.api_key = self.encryption.decrypt(user.api_key)
        return user

    def update_user_settings(
        self, 
        db: Session, 
        user_id: int, 
        settings: SettingsUpdate
    ) -> User:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return None

        # Update only provided fields
        if settings.api_key is not None:
            # Encrypt API key before storing
            user.api_key = self.encryption.encrypt(settings.api_key)
        if settings.system_prompt is not None:
            user.system_prompt = settings.system_prompt

        db.commit()
        db.refresh(user)
        
        # Decrypt API key for response
        if user.api_key:
            user.api_key = self.encryption.decrypt(user.api_key)
        return user 