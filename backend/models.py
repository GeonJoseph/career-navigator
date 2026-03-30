from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    refresh_token = Column(String, nullable=True)
    reset_password_token = Column(String, nullable=True)
    reset_password_expire = Column(DateTime(timezone=True), nullable=True)
    
    # Email Verification
    is_verified = Column(Boolean, default=False)
    verification_code = Column(String, nullable=True)
    
    # Basic Profile
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    profile_photo = Column(String, nullable=True)
    
    # Professional Profile
    current_title = Column(String, nullable=True)
    target_title = Column(String, nullable=True)
    experience_level = Column(String, nullable=True)
    skills = Column(Text, nullable=True)  # JSON or comma-separated
    interests = Column(Text, nullable=True)
    location = Column(String, nullable=True)
    biggest_challenge = Column(Text, nullable=True)
    dob = Column(String, nullable=True)
    phone_number = Column(String, nullable=True)
    languages = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    portfolio_url = Column(String, nullable=True)

    # Document-Aware Profile addition
    user_type = Column(String, default="student") # "professional" or "student"
    document_text = Column(Text, nullable=True)
    document_filename = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    role = Column(String, default="User")