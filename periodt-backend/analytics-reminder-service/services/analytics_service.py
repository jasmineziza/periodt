import os
from collections import Counter
from datetime import date

import httpx

CYCLE_SERVICE_URL = os.getenv("CYCLE_SERVICE_URL", "http://cycle-wellness-service:8001")


async def fetch_cycle_data(user_id: int):
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(f"{CYCLE_SERVICE_URL}/cycles/{user_id}")
        response.raise_for_status()
        return response.json()


async def fetch_mood_data(user_id: int):
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(f"{CYCLE_SERVICE_URL}/moods/{user_id}")
        response.raise_for_status()
        return response.json()


def _period_length_days(cycle: dict):
    """Panjang menstruasi = end_date - start_date (inklusif)."""
    try:
        start = date.fromisoformat(str(cycle["start_date"]))
        end = date.fromisoformat(str(cycle["end_date"]))
        return (end - start).days + 1
    except (KeyError, ValueError, TypeError):
        return None


async def generate_user_analytics(user_id: int):
    cycles = await fetch_cycle_data(user_id)
    moods = await fetch_mood_data(user_id)

    if not isinstance(cycles, list):
        cycles = []
    if not isinstance(moods, list):
        moods = []

    cycle_lengths = [c.get("cycle_length") for c in cycles if c.get("cycle_length")]
    period_lengths = [p for p in (_period_length_days(c) for c in cycles) if p]

    avg_cycle = sum(cycle_lengths) / len(cycle_lengths) if cycle_lengths else 0
    avg_period = sum(period_lengths) / len(period_lengths) if period_lengths else 0

    mood_values = [m.get("mood") for m in moods if m.get("mood")]
    most_common_mood = Counter(mood_values).most_common(1)[0][0] if mood_values else None

    return {
        "average_cycle": round(avg_cycle, 2),
        "average_period": round(avg_period, 2),
        "most_common_mood": most_common_mood,
        "total_records": len(cycles),
    }
