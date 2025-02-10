from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.settings import SettingsUpdate

class SettingsService:
    def get_user_settings(self, db: Session, user_id: int) -> User:
        return db.query(User).filter(User.id == user_id).first()

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
            user.api_key = settings.api_key
        if settings.system_prompt is not None:
            user.system_prompt = settings.system_prompt

        db.commit()
        db.refresh(user)
        return user 