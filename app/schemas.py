from pydantic import BaseModel


class ReminderBase(BaseModel):
    type: str
    reminder_time: str


class ReminderCreate(ReminderBase):
    pass


class ReminderResponse(ReminderBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True