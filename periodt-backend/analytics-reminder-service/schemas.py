from pydantic import BaseModel


class ReminderBase(BaseModel):
    type: str
    reminder_time: str


class ReminderCreate(ReminderBase):
    user_id: int


class ReminderResponse(ReminderBase):
    id: int
    user_id: int

    model_config = {"from_attributes": True}
