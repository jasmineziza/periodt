from pydantic import BaseModel
from datetime import date
from pydantic import BaseModel

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