from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import MoodLog
from schemas import MoodCreate

router = APIRouter(
    prefix="/moods",
    tags=["Mood Logs"]
)

@router.post("/")
def create_mood(
    mood: MoodCreate,
    db: Session = Depends(get_db)
):
    new_mood = MoodLog(
        user_id=mood.user_id,
        mood=mood.mood,
        note=mood.note
    )

    db.add(new_mood)
    db.commit()
    db.refresh(new_mood)

    return new_mood


@router.get("/{user_id}")
def get_user_moods(
    user_id: int,
    db: Session = Depends(get_db)
):
    moods = db.query(MoodLog).filter(
        MoodLog.user_id == user_id
    ).all()

    return moods