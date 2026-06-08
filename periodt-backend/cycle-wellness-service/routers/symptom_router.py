from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import SymptomLog
from schemas import SymptomCreate

router = APIRouter(
    prefix="/symptoms",
    tags=["Symptom Logs"]
)

@router.post("/")
def create_symptom(
    symptom: SymptomCreate,
    db: Session = Depends(get_db)
):
    new_symptom = SymptomLog(
        user_id=symptom.user_id,
        symptom=symptom.symptom,
        severity=symptom.severity
    )

    db.add(new_symptom)
    db.commit()
    db.refresh(new_symptom)

    return new_symptom


@router.get("/{user_id}")
def get_user_symptoms(
    user_id: int,
    db: Session = Depends(get_db)
):
    return db.query(SymptomLog).filter(
        SymptomLog.user_id == user_id
    ).all()