from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas
import auth as auth_utils

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=schemas.UserResponse, status_code=201)
async def register(user_data: schemas.UserRegister, db: Session = Depends(get_db)):
    """Daftar akun baru."""
    existing = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email sudah terdaftar. Gunakan email lain atau login."
        )

    user = models.User(
        email=user_data.email,
        name=user_data.name,
        password_hash=auth_utils.hash_password(user_data.password),
        date_of_birth=user_data.date_of_birth,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=schemas.Token)
async def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    """Login dan dapatkan JWT token."""
    user = db.query(models.User).filter(models.User.email == credentials.email).first()

    if not user or not auth_utils.verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password salah."
        )

    token = auth_utils.create_access_token(user.id)
    return {"access_token": token, "token_type": "bearer"}


@router.post("/logout")
async def logout():
    """Logout (client cukup hapus token dari localStorage)."""
    return {"message": "Logout berhasil. Hapus token dari client."}