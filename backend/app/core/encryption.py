from cryptography.fernet import Fernet
from app.core.config import settings

class EncryptionService:
    def __init__(self):
        self.fernet = Fernet(settings.ENCRYPTION_KEY.encode())

    def encrypt(self, data: str) -> str:
        if not data:
            return None
        return self.fernet.encrypt(data.encode()).decode()

    def decrypt(self, encrypted_data: str) -> str:
        if not encrypted_data:
            return None
        return self.fernet.decrypt(encrypted_data.encode()).decode() 