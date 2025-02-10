from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    api_key = Column(String, nullable=True)
    system_prompt = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship with invoices - using string reference to avoid circular import
    invoices = relationship("Invoice", back_populates="user", lazy="dynamic") 