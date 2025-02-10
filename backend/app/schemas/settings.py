from pydantic import BaseModel, Field
from typing import Optional

class Settings(BaseModel):
    api_key: Optional[str] = Field(None, description="OpenAI API key")
    system_prompt: Optional[str] = Field(
        None,
        description="Custom system prompt for invoice extraction"
    )

class SettingsUpdate(BaseModel):
    api_key: Optional[str] = None
    system_prompt: Optional[str] = None

class SettingsResponse(BaseModel):
    api_key: Optional[str] = None
    system_prompt: Optional[str] = None
    has_api_key: bool

    @classmethod
    def from_user(cls, user):
        return cls(
            api_key="*" * 8 if user.api_key else None,  # Don't expose actual API key
            system_prompt=user.system_prompt,
            has_api_key=bool(user.api_key)
        ) 