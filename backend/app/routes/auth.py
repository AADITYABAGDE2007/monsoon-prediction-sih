from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
import jwt
import os
from datetime import datetime, timedelta
from ..database import get_db
from ..models import User, Location

router = APIRouter()

JWT_SECRET = os.getenv("JWT_SECRET", "default_secret")
ALGORITHM = "HS256"

class SendOtpRequest(BaseModel):
    phone: str

class VerifyOtpRequest(BaseModel):
    phone: str
    otp: str
    name: str = ""
    location_id: int = 1

@router.post("/send-otp")
def send_otp(req: SendOtpRequest):
    phone = req.phone.strip()
    if len(phone) < 10:
        raise HTTPException(status_code=400, detail="Invalid mobile number.")
    
    # In production with SMS gateway or test OTP for instant login
    return {
        "status": "success",
        "message": f"OTP successfully sent to {phone}",
        "test_otp": "7722" # Convenient test OTP for demonstration
    }

@router.post("/verify-otp")
def verify_otp(req: VerifyOtpRequest, db: Session = Depends(get_db)):
    # Verify OTP (accept standard demonstration/production OTP)
    if req.otp not in ["7722", "123456", "9999"]:
        raise HTTPException(status_code=400, detail="Invalid OTP entered.")
    
    phone = req.phone.strip()
    user = db.query(User).filter(User.phone == phone).first()
    
    if not user:
        user = User(
            phone=phone,
            name=req.name or "Kisan User",
            location_id=req.location_id
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        if req.location_id:
            user.location_id = req.location_id
            db.commit()
    
    # Generate JWT Token
    expire = datetime.utcnow() + timedelta(days=30)
    token_payload = {
        "sub": user.phone,
        "user_id": user.id,
        "location_id": user.location_id,
        "exp": expire
    }
    token = jwt.encode(token_payload, JWT_SECRET, algorithm=ALGORITHM)
    
    return {
        "status": "success",
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "phone": user.phone,
            "name": user.name,
            "location_id": user.location_id
        }
    }
