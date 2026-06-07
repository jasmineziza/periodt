from sqlalchemy import Column, Integer, String, Time
from database import Base


class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, nullable=False)

    type = Column(String, nullable=False)

    reminder_time = Column(String, nullable=False)