import httpx
from fastapi import APIRouter, HTTPException

from services.analytics_service import (
    CYCLE_SERVICE_URL,
    generate_user_analytics,
)

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("/analytics/{user_id}")
async def get_user_analytics(user_id: int):
    try:
        return await generate_user_analytics(user_id)
    except httpx.HTTPError:
        raise HTTPException(status_code=502, detail="Gagal mengambil data dari cycle service")


@router.get("/analytics/mood/{user_id}")
async def get_user_mood(user_id: int):
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(f"{CYCLE_SERVICE_URL}/moods/{user_id}")
        if response.status_code != 200:
            raise HTTPException(status_code=502, detail="Gagal mengambil data mood")
        return response.json()


@router.get("/analytics/cycle/{user_id}")
async def get_user_cycle(user_id: int):
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(f"{CYCLE_SERVICE_URL}/cycles/{user_id}")
        if response.status_code != 200:
            raise HTTPException(status_code=502, detail="Gagal mengambil data cycle")
        return response.json()
