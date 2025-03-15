from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import Note
from database import get_db
from pydantic import BaseModel
from utils import get_object_or_404
from schemas import NoteCreate, NoteUpdate

router = APIRouter(prefix="/notes", tags=["Notes"])

@router.get("/")
def get_notes(db: Session = Depends(get_db)):
    return db.query(Note).all()

class TextInput(BaseModel):
    text: str

@router.post("/summarize")
async def summarize_text(input: TextInput):
    # For now, return a simple summary (first 100 characters)
    # You can replace this with actual AI summarization later
    summary = input.text[:100] + "..." if len(input.text) > 100 else input.text
    return {"summary": summary}

@router.post("/", response_model=NoteCreate)
def create_note(note_data: NoteCreate, db: Session = Depends(get_db)):
    new_note = Note(title=note_data.title, content=note_data.content)
    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note

@router.get("/{note_id}")
def get_note(note_id: int, db: Session = Depends(get_db)):
    return get_object_or_404(Note, note_id, db)

@router.put("/{note_id}")
def update_note(note_id: int, note_data: NoteUpdate, db: Session = Depends(get_db)):
    note = get_object_or_404(Note, note_id, db)
    note.title = note_data.title
    note.content = note_data.content
    db.commit()
    db.refresh(note)
    return note

@router.delete("/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db)):
    note = get_object_or_404(Note, note_id, db)
    db.delete(note)
    db.commit()
    return {"detail": "Note deleted successfully"}


