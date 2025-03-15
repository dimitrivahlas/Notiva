from pydantic import BaseModel, Field

class NoteCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=100, description="Title must be between 1 and 100 characters")
    content: str = Field(..., min_length=1, description="Content cannot be empty")

class NoteUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=100, description="Title must be between 1 and 100 characters")
    content: str | None = Field(None, min_length=1, description="Content cannot be empty")