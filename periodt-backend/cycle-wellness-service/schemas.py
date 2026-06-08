from pydantic import BaseModel
from datetime import date


class MoodCreate(BaseModel):
    user_id: int
    mood: str
    note: str

class CycleCreate(BaseModel):
    user_id: int
    start_date: date
    end_date: date

class CycleResponse(BaseModel):
    id: int
    user_id: int
    start_date: date
    end_date: date
    cycle_length: int

    class Config:
        from_attributes = True

class SymptomCreate(BaseModel):
    user_id: int
    symptom: str
    severity: str

class DashboardResponse(BaseModel):
    user_id: int

    last_period: date | None
    next_period: date | None
    ovulation_date: date | None

    cycle_length: int | None

    latest_mood: str | None
    latest_note: str | None

    latest_symptom: str | None
    symptom_severity: str | None