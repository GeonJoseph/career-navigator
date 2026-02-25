from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

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
