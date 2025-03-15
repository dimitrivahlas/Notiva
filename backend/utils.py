from fastapi import HTTPException
from sqlalchemy.orm import Session

def get_object_or_404(model, model_id: int, db: Session):
    obj = db.query(model).filter(model.id == model_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail=f"{model.__name__} not found")
    return obj