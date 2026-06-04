from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import httpx

from app.database import get_db

router = APIRouter()

# GET user analytics
@router.get("/analytics/{user_id}")
async def get_user_analytics(user_id: int, db: Session = Depends(get_db)):
    async with httpx.AsyncClient() as client:
        # request data siklus dari cycle service
        response = await client.get(f"http://cycle-service:8001/cycle/{user_id}")
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to fetch cycle data")
        data = response.json()

    cycles = [c['length'] for c in data.get('cycles', [])]
    avg_cycle = sum(cycles)/len(cycles) if cycles else 0
    avg_period = sum([c['period_length'] for c in data.get('cycles', [])])/len(cycles) if cycles else 0

    # mood stats
    moods = [m['mood'] for m in data.get('moods', [])]
    from collections import Counter
    most_common_mood = Counter(moods).most_common(1)[0][0] if moods else None

    return {
        "average_cycle": avg_cycle,
        "average_period": avg_period,
        "most_common_mood": most_common_mood
    }

# GET mood history
@router.get("/analytics/mood/{user_id}")
async def get_user_mood(user_id: int):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"http://cycle-service:8001/mood/{user_id}")
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to fetch mood data")
        data = response.json()
    return data

# GET cycle history
@router.get("/analytics/cycle/{user_id}")
async def get_user_cycle(user_id: int):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"http://cycle-service:8001/cycle/{user_id}")
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to fetch cycle data")
        data = response.json()
    return data