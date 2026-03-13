from sqlalchemy.orm import Session
from fastapi import FastAPI, Depends, HTTPException, Security, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from fastapi.security import OAuth2PasswordBearer
from security import hash_password, verify_password
from database import engine, SessionLocal
from models import Base, User
from jose import jwt, JWTError
from auth import create_access_token, create_refresh_token, SECRET_KEY, ALGORITHM
from services.jsearch_service import search_jobs, search_internships
from services.course_service import search_courses

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    # Dev-only: allow any origin. We are not using cookies here (tokens are
    # returned in JSON and stored by the frontend), so credentials are disabled.
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme),
                     db: Session = Depends(get_db)):

    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")

        if email is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.email == email).first()

    if user is None:
        raise credentials_exception

    return user

class ChatRequest(BaseModel):
    message: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class RefreshRequest(BaseModel):
    refresh_token: str

class LogoutRequest(BaseModel):
    refresh_token: str

class UpdateRoleRequest(BaseModel):
    role: str

class ProfileUpdateRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    profile_photo: Optional[str] = None
    current_title: Optional[str] = None
    target_title: Optional[str] = None
    experience_level: Optional[str] = None
    skills: Optional[str] = None
    interests: Optional[str] = None
    location: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None

class ProfileResponse(BaseModel):
    first_name: Optional[str]
    last_name: Optional[str]
    email: str
    profile_photo: Optional[str]
    name: str  # Original composite name
    current_title: Optional[str]
    target_title: Optional[str]
    experience_level: Optional[str]
    skills: Optional[str]
    interests: Optional[str]
    location: Optional[str]
    linkedin_url: Optional[str]
    portfolio_url: Optional[str]

@app.get("/")
def root():
    return {"message": "Backend running"}

@app.post("/chat")
def chat(request: ChatRequest, current_user: User = Depends(get_current_user)):
    user_text = request.message.lower()

    # Very simple temporary logic
    if "data" in user_text:
        reply = [
            "Data Analyst",
            "Business Analyst",
            "AI Engineer"
        ]
    elif "design" in user_text:
        reply = [
            "Graphic Designer",
            "UI/UX Designer",
            "Content Creator"
        ]
    else:
        reply = [
            "Software Developer",
            "Teacher",
            "Marketing Specialist"
        ]

    return {"recommendations": reply}

@app.post("/register")
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = hash_password(request.password)

    new_user = User(
        name=request.name,
        email=request.email,
        hashed_password=hashed_pw
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = create_access_token({
        "sub": new_user.email,
        "role": new_user.role
    })
    refresh_token = create_refresh_token({"sub": new_user.email})

    new_user.refresh_token = refresh_token
    db.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token
    }

@app.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == request.email).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token({
        "sub": user.email,
        "role": user.role
    })
    refresh_token = create_refresh_token({"sub": user.email})

    # Store refresh token in DB (overwrite old one)
    user.refresh_token = refresh_token
    db.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@app.post("/refresh")
def refresh(request: RefreshRequest, db: Session = Depends(get_db)):

    try:
        payload = jwt.decode(
            request.refresh_token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        email = payload.get("sub")

        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = db.query(User).filter(User.email == email).first()

    if not user or user.refresh_token != request.refresh_token:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    new_access_token = create_access_token({
        "sub": user.email,
        "role": user.role
    })

    return {
        "access_token": new_access_token,
        "token_type": "bearer"
    }

@app.post("/logout")
def logout(request: LogoutRequest, db: Session = Depends(get_db)):

    try:
        payload = jwt.decode(
            request.refresh_token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        email = payload.get("sub")

        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = db.query(User).filter(User.email == email).first()

    if not user or user.refresh_token != request.refresh_token:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    # Invalidate refresh token
    user.refresh_token = None
    db.commit()

    return {"message": "Logged out successfully"}

@app.get("/me")
def read_current_user(
    current_user: User = Security(get_current_user)
):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email
    }

@app.get("/admin/users")
def get_all_users(current_user: User = Security(get_current_user),
                  db: Session = Depends(get_db)):

    if current_user.role != "Admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    users = db.query(User).all()

    return [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "status": "Active" if u.refresh_token else "Inactive",
            "joined": u.created_at.strftime("%Y-%m-%d")
        }
        for u in users
    ]

@app.patch("/admin/users/{user_id}")
def update_user_role(
    user_id: int,
    request: UpdateRoleRequest,
    current_user: User = Security(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "Admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if request.role not in ["User", "Admin"]:
        raise HTTPException(status_code=400, detail="Invalid role")

    user.role = request.role
    db.commit()

    return {"message": "Role updated successfully"}

@app.delete("/admin/users/{user_id}")
def delete_user(
    user_id: int,
    current_user: User = Security(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "Admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()

    return {"message": "User deleted successfully"}


# ────────────────────────────────────────────────────────────────
# Realtime Jobs, Internships & Courses
# ────────────────────────────────────────────────────────────────

@app.get("/api/jobs")
def get_jobs(
    query: str = Query("", description="Job search query"),
    location: str = Query("", description="Location filter"),
    page: int = Query(1, ge=1, description="Page number"),
    current_user: User = Depends(get_current_user),
):
    results = search_jobs(query=query, location=location, page=page)
    return results


@app.get("/api/internships")
def get_internships(
    query: str = Query("", description="Internship search query"),
    location: str = Query("", description="Location filter"),
    page: int = Query(1, ge=1, description="Page number"),
    current_user: User = Depends(get_current_user),
):
    print(f"DEBUG: Received internship query='{query}' alias_q")
    results = search_internships(query=query, location=location, page=page)
    return results


@app.get("/api/courses")
def get_courses(
    query: str = Query("", description="Course search query"),
    current_user: User = Depends(get_current_user),
):
    results = search_courses(query=query)
    return {"results": results}

@app.get("/api/user/profile", response_model=ProfileResponse)
def get_user_profile(current_user: User = Depends(get_current_user)):
    return {
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "email": current_user.email,
        "profile_photo": current_user.profile_photo,
        "name": current_user.name,
        "current_title": current_user.current_title,
        "target_title": current_user.target_title,
        "experience_level": current_user.experience_level,
        "skills": current_user.skills,
        "interests": current_user.interests,
        "location": current_user.location,
        "linkedin_url": current_user.linkedin_url,
        "portfolio_url": current_user.portfolio_url
    }

@app.put("/api/user/profile")
def update_user_profile(request: ProfileUpdateRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if request.first_name is not None:
        current_user.first_name = request.first_name
    if request.last_name is not None:
        current_user.last_name = request.last_name
    if request.profile_photo is not None:
        current_user.profile_photo = request.profile_photo
    if request.current_title is not None:
        current_user.current_title = request.current_title
    if request.target_title is not None:
        current_user.target_title = request.target_title
    if request.experience_level is not None:
        current_user.experience_level = request.experience_level
    if request.skills is not None:
        current_user.skills = request.skills
    if request.interests is not None:
        current_user.interests = request.interests
    if request.location is not None:
        current_user.location = request.location
    if request.linkedin_url is not None:
        current_user.linkedin_url = request.linkedin_url
    if request.portfolio_url is not None:
        current_user.portfolio_url = request.portfolio_url
    
    # Also update the original 'name' field for compatibility
    if request.first_name or request.last_name:
        fname = request.first_name if request.first_name else (current_user.first_name or "")
        lname = request.last_name if request.last_name else (current_user.last_name or "")
        current_user.name = f"{fname} {lname}".strip()
    
    db.commit()
    return {"message": "Profile updated successfully"}
