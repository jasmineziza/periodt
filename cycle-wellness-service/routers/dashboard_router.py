from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import timedelta

from database import get_db
from models import Cycle, MoodLog, SymptomLog

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/{user_id}")
def get_dashboard(
    user_id: int,
    db: Session = Depends(get_db)
):
    latest_cycle = (
        db.query(Cycle)
        .filter(Cycle.user_id == user_id)
        .order_by(Cycle.start_date.desc())
        .first()
    )

    latest_mood = (
        db.query(MoodLog)
        .filter(MoodLog.user_id == user_id)
        .order_by(MoodLog.id.desc())
        .first()
    )

    latest_symptom = (
        db.query(SymptomLog)
        .filter(SymptomLog.user_id == user_id)
        .order_by(SymptomLog.id.desc())
        .first()
    )

    if not latest_cycle:
        return {
            "error": "No cycle data found"
        }

    return {
        "user_id": user_id,

        "last_period": latest_cycle.start_date,
        "next_period": latest_cycle.start_date + timedelta(days=28),
        "ovulation_date": latest_cycle.start_date + timedelta(days=14),

        "cycle_length": latest_cycle.cycle_length,

        "latest_mood": latest_mood.mood if latest_mood else None,
        "latest_note": latest_mood.note if latest_mood else None,

        "latest_symptom": latest_symptom.symptom if latest_symptom else None,
        "symptom_severity": latest_symptom.severity if latest_symptom else None
    }