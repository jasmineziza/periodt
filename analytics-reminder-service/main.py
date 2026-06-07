from fastapi import FastAPI
from database import engine
from models import Base

from routers import analytics
from routers import reminder

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Analytics & Reminder Service"
)

app.include_router(reminder.router)
app.include_router(analytics.router)

@app.get("/", tags=["Health"])
async def root():
    return {
        "service": "Analytics & Reminder Service",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "service": "analytics-reminder-service", "port": 8002}