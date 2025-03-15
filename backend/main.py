from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import engine, Base, get_db
from models import Note
from fastapi.middleware.cors import CORSMiddleware
from routes import notes

app = FastAPI()

# Create tables
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "http://localhost:5173"],  # ✅ Allow frontend access
    allow_credentials=True,
    allow_methods=["*"],  # ✅ Allow all HTTP methods (GET, POST, PUT, DELETE)
    allow_headers=["*"],  # ✅ Allow all headers
)

# Include API routes
app.include_router(notes.router)


@app.get("/")
def root():
    return {"message": "Welcome to Notiva API"}

# Fetch all notes
@app.get("/notes")
def get_notes(db: Session = Depends(get_db)):
    return db.query(Note).all()

# Create a new note
@app.post("/notes")
def create_note(title: str, content: str, db: Session = Depends(get_db)):
    note = Note(title=title, content=content)
    db.add(note)
    db.commit()
    db.refresh(note)
    return note
