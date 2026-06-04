import httpx
from collections import Counter


CYCLE_SERVICE_URL = "http://cycle-service:8001"


# ambil data cycle user dari service 8001
async def fetch_cycle_data(user_id: int):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{CYCLE_SERVICE_URL}/cycle/{user_id}")
        response.raise_for_status()
        return response.json()


# ambil data mood user dari service 8001
async def fetch_mood_data(user_id: int):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{CYCLE_SERVICE_URL}/mood/{user_id}")
        response.raise_for_status()
        return response.json()


# hitung analytics utama
async def generate_user_analytics(user_id: int):

    cycle_data = await fetch_cycle_data(user_id)
    mood_data = await fetch_mood_data(user_id)

    cycles = cycle_data.get("cycles", [])

    cycle_lengths = [c["length"] for c in cycles if "length" in c]
    period_lengths = [c["period_length"] for c in cycles if "period_length" in c]

    avg_cycle = sum(cycle_lengths) / len(cycle_lengths) if cycle_lengths else 0
    avg_period = sum(period_lengths) / len(period_lengths) if period_lengths else 0

    moods = [m["mood"] for m in mood_data.get("moods", [])]
    most_common_mood = Counter(moods).most_common(1)[0][0] if moods else None

    return {
        "average_cycle": round(avg_cycle, 2),
        "average_period": round(avg_period, 2),
        "most_common_mood": most_common_mood,
        "total_records": len(cycles)
    }