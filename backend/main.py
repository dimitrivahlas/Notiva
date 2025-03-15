from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import engine, Base, get_db
from models import Note

app = FastAPI()

# Create tables
Base.metadata.create_all(bind=engine)

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
