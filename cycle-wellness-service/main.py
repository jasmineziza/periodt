from fastapi import FastAPI
from routers.cycle_router import router as cycle_router
import models
from database import engine
from routers.mood_router import router as mood_router
from routers.symptom_router import router as symptom_router
from routers.dashboard_router import router as dashboard_router

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Cycle & Wellness Service"
)

app.include_router(cycle_router)
app.include_router(mood_router)
app.include_router(symptom_router)
app.include_router(dashboard_router)


@app.get("/", tags=["Health"])
async def root():
    return {
        "service": "Cycle & Wellness Service",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "service": "cycle-wellness-service", "port": 8001}