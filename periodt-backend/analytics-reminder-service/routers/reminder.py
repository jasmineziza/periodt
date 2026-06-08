from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models
import schemas
from database import get_db
from services.reminder_service import validate_time_format

router = APIRouter(
    prefix="/reminder",
    tags=["Reminders"]
)


@router.post("/reminder", response_model=schemas.ReminderResponse, status_code=201)
def create_reminder(
    reminder: schemas.ReminderCreate,
    db: Session = Depends(get_db)
):
    if not validate_time_format(reminder.reminder_time):
        raise HTTPException(status_code=422, detail="Format jam tidak valid. Gunakan HH:MM.")

    db_reminder = models.Reminder(
        user_id=reminder.user_id,
        type=reminder.type,
        reminder_time=reminder.reminder_time,
    )

    db.add(db_reminder)
    db.commit()
    db.refresh(db_reminder)
    return db_reminder


@router.get("/reminder/{user_id}", response_model=list[schemas.ReminderResponse])
def get_reminders(
    user_id: int,
    db: Session = Depends(get_db)
):
    return db.query(models.Reminder).filter(models.Reminder.user_id == user_id).all()


@router.delete("/reminder/{reminder_id}", status_code=204)
def delete_reminder(
    reminder_id: int,
    db: Session = Depends(get_db)
):
    db_reminder = db.query(models.Reminder).filter(models.Reminder.id == reminder_id).first()
    if not db_reminder:
        raise HTTPException(status_code=404, detail="Reminder tidak ditemukan.")
    db.delete(db_reminder)
    db.commit()
