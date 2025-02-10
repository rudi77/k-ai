from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base_class import Base

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    file_path = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)
    extracted_data = Column(JSON, nullable=True)
    processing_status = Column(String, default="pending")  # pending, completed, failed
    error_message = Column(String, nullable=True)
    upload_date = Column(DateTime, default=datetime.utcnow)

    # Relationship with user
    user = relationship("User", back_populates="invoices") 