from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas

from app.services.reminder_service import validate_time_format  

router = APIRouter()


@router.post("/reminder")
def create_reminder(
    user_id: int,
    reminder: schemas.ReminderCreate,
    db: Session = Depends(get_db)
):
    if not validate_time_format(reminder.reminder_time):
        raise ValueError("Invalid time format. Use HH:MM.")
    
    db_reminder = models.Reminder(
        user_id=user_id,
        type=reminder.type,
        reminder_time=reminder.reminder_time
    )

    db.add(db_reminder)
    db.commit()
    db.refresh(db_reminder)

@router.get("/reminder/{user_id}")
def get_reminders(
    user_id: int, 
    db: Session = Depends(get_db)
):
    
    db_reminder = db.query(models.Reminder).filter(models.Reminder.user_id == user_id).all()
    return db_reminder

@router.delete("/reminder/{reminder_id}")
def delete_reminder(
    reminder_id: int, 
    db: Session = Depends(get_db)
):
    
    db_reminder = db.query(models.Reminder).filter(models.Reminder.id == reminder_id).first()
    if db_reminder:
        db.delete(db_reminder)
        db.commit()

    return db_reminder