from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.db.base import Base  # This will import all models
from app.models.user import User
from datetime import datetime
from passlib.context import CryptContext

# Create password context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_test_user():
    db = SessionLocal()
    try:
        # Check if test user already exists
        existing_user = db.query(User).filter(User.email == "test@example.com").first()
        if existing_user:
            print("Test user already exists")
            return
        
        # Create password hash
        password = "testpassword123"
        hashed_password = pwd_context.hash(password)
        
        # Create user
        user = User(
            id=1,  # Explicitly set ID to 1
            email="test@example.com",
            hashed_password=hashed_password,
            created_at=datetime.utcnow()
        )
        
        db.add(user)
        db.commit()
        print("Test user created successfully")
        
    except Exception as e:
        print(f"Error creating test user: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user() 