from fastapi import FastAPI
from routers.cycle_router import router as cycle_router
import models
from database import engine
from routers.mood_router import router as mood_router

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Cycle & Wellness Service"
)

app.include_router(cycle_router)
app.include_router(mood_router)

@app.get("/")
def root():
    return {"message": "Cycle Service Running"}