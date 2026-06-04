from fastapi import FastAPI
from app.database import engine
from app.models import Base

from app.routes import analytics
from app.routes import reminder

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(reminder.router)
app.include_router(analytics.router)