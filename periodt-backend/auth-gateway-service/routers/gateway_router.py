import os

import httpx
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse, Response

from auth import get_current_user
import models

router = APIRouter(tags=["Gateway"])

CYCLE_SERVICE_URL = os.getenv("CYCLE_SERVICE_URL", "http://cycle-wellness-service:8001")
ANALYTICS_SERVICE_URL = os.getenv("ANALYTICS_SERVICE_URL", "http://analytics-reminder-service:8002")

SERVICE_ROUTES = {
    "cycles": CYCLE_SERVICE_URL,
    "moods": CYCLE_SERVICE_URL,
    "symptoms": CYCLE_SERVICE_URL,
    "dashboard": CYCLE_SERVICE_URL,
    "analytics": ANALYTICS_SERVICE_URL,
    "reminder": ANALYTICS_SERVICE_URL,
}

_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"]


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
        except httpx.TimeoutException:
            raise HTTPException(status_code=504, detail="Service timeout")

    if resp.status_code == 204 or not resp.content:
        return Response(status_code=resp.status_code)

    content_type = resp.headers.get("Content-Type", "")
    if content_type.startswith("application/json"):
        try:
            return JSONResponse(content=resp.json(), status_code=resp.status_code)
        except ValueError:
            pass
    return Response(
        content=resp.content,
        status_code=resp.status_code,
        media_type=content_type or "application/octet-stream",
    )


def _make_handler(prefix: str, base_url: str):
    async def handler(
        path: str,
        request: Request,
        current_user: models.User = Depends(get_current_user),
    ):
        return await forward(request, f"{base_url}/{prefix}/{path}", current_user.id)

    return handler


for _prefix, _base in SERVICE_ROUTES.items():
    router.add_api_route(
        f"/{_prefix}/{{path:path}}",
        _make_handler(_prefix, _base),
        methods=_METHODS,
    )
