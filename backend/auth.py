# backend/auth.py
"""
Simple authentication system (hardcoded for demo)
In production, use proper database and password hashing
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

# Hardcoded user database
USERS_DB = {
    "PES1UG24CS053": {
        "patient_id": "PES1UG24CS053",
        "name": "Amogh",
        "age": 19,
        "gender": "Male"
    }
}

# Store additional registered users (in-memory for demo)
registered_users = {}


class SignupRequest(BaseModel):
    name: str
    age: int
    gender: str


class LoginRequest(BaseModel):
    patient_id: str


class UserResponse(BaseModel):
    patient_id: str
    name: str
    age: int
    gender: str


@router.post("/signup", response_model=UserResponse)
async def signup(request: SignupRequest):
    """Register a new patient"""
    
    # Generate new patient ID
    existing_count = len(USERS_DB) + len(registered_users)
    new_id = f"PES1UG24CS{str(existing_count + 54).zfill(3)}"
    
    # Create new user
    new_user = {
        "patient_id": new_id,
        "name": request.name,
        "age": request.age,
        "gender": request.gender
    }
    
    # Store in registered users
    registered_users[new_id] = new_user
    
    return new_user


@router.post("/login", response_model=UserResponse)
async def login(request: LoginRequest):
    """Login with patient ID"""
    
    patient_id = request.patient_id.upper().strip()
    
    # Check in main DB
    if patient_id in USERS_DB:
        return USERS_DB[patient_id]
    
    # Check in registered users
    if patient_id in registered_users:
        return registered_users[patient_id]
    
    # User not found
    raise HTTPException(status_code=404, detail="Patient ID not found")


@router.get("/verify/{patient_id}", response_model=UserResponse)
async def verify_patient(patient_id: str):
    """Verify if patient ID exists"""
    
    patient_id = patient_id.upper().strip()
    
    if patient_id in USERS_DB:
        return USERS_DB[patient_id]
    
    if patient_id in registered_users:
        return registered_users[patient_id]
    
    raise HTTPException(status_code=404, detail="Patient ID not found")