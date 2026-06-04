from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine
import models
from routers import auth_router, user_router, gateway_router

# Buat tabel di database saat startup
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PERIODT — Auth & Gateway Service",
    description=(
        "Service milik Jasmine (5053231003)\n\n"
        "Handles: API Gateway + Register/Login/JWT + User Profile\n\n"
        "Port: 8000"
    ),
    version="1.0.0",
)

# CORS — izinkan frontend React mengakses API ini
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Sesuaikan dengan URL frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Daftarkan semua router
app.include_router(auth_router.router)
app.include_router(user_router.router)
app.include_router(gateway_router.router)


@app.get("/", tags=["Health"])
async def root():
    return {
        "service": "Auth & Gateway Service",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "service": "auth-gateway", "port": 8000}