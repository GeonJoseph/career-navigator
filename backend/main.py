from sqlalchemy.orm import Session
from fastapi import FastAPI, Depends, HTTPException, Security
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from fastapi.security import OAuth2PasswordBearer
from security import hash_password, verify_password
from database import engine, SessionLocal
from models import Base, User
from jose import jwt, JWTError
from auth import create_access_token, create_refresh_token, SECRET_KEY, ALGORITHM

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
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

@app.get("/")
def root():
    return {"message": "Backend running"}

@app.post("/chat")
def chat(request: ChatRequest):
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

    access_token = create_access_token({"sub": new_user.email})
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

    access_token = create_access_token({"sub": user.email})
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

    new_access_token = create_access_token({"sub": user.email})

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