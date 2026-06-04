import httpx
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import JSONResponse

from auth import get_current_user
import models

router = APIRouter(tags=["Gateway"])

CYCLE_SERVICE_URL = "http://cycle-wellness-service:8001"
ANALYTICS_SERVICE_URL = "http://analytics-reminder-service:8002"


async def forward(request: Request, target_url: str, user_id: int):
    body = await request.body()
    headers = {
        "Content-Type": request.headers.get("Content-Type", "application/json"),
        "X-User-ID": str(user_id),
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            resp = await client.request(
                method=request.method,
                url=target_url,
                headers=headers,
                content=body,
                params=dict(request.query_params),
            )
        except httpx.ConnectError:
            raise HTTPException(status_code=503, detail="Service tidak dapat dihubungi")

    try:
        return JSONResponse(content=resp.json(), status_code=resp.status_code)
    except Exception:
        return JSONResponse(content={"detail": resp.text}, status_code=resp.status_code)


@router.api_route("/cycle/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def gateway_cycle(path: str, request: Request, current_user: models.User = Depends(get_current_user)):
    return await forward(request, f"{CYCLE_SERVICE_URL}/cycle/{path}", current_user.id)


@router.api_route("/analytics/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def gateway_analytics(path: str, request: Request, current_user: models.User = Depends(get_current_user)):
    return await forward(request, f"{ANALYTICS_SERVICE_URL}/analytics/{path}", current_user.id)


@router.api_route("/reminder/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def gateway_reminder(path: str, request: Request, current_user: models.User = Depends(get_current_user)):
    return await forward(request, f"{ANALYTICS_SERVICE_URL}/reminder/{path}", current_user.id)