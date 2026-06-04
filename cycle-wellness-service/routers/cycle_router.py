from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Cycle
from schemas import CycleCreate
from datetime import date, timedelta

router = APIRouter(
    prefix="/cycles",
    tags=["Cycles"]
)

@router.get("/")
def get_cycles():
    return {"message": "Cycle endpoint working"}

@router.get("/prediction/{user_id}")
def predict_cycle(user_id: int):

    last_period = date.today()

    next_period = last_period + timedelta(days=28)

    ovulation_date = next_period - timedelta(days=14)

    return {
        "user_id": user_id,
        "next_period": next_period,
        "ovulation_date": ovulation_date
    }

@router.post("/")
def create_cycle(
    cycle: CycleCreate,
    db: Session = Depends(get_db)
):
    new_cycle = Cycle(
        user_id=cycle.user_id,
        start_date=cycle.start_date,
        end_date=cycle.end_date,
        cycle_length=28
    )

    db.add(new_cycle)
    db.commit()
    db.refresh(new_cycle)

    return new_cycle

@router.get("/{user_id}")
def get_user_cycles(
    user_id: int,
    db: Session = Depends(get_db)
):
    cycles = db.query(Cycle).filter(
        Cycle.user_id == user_id
    ).all()

    return cycles