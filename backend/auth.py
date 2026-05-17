from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

router = APIRouter()

class UserLogin(BaseModel):
    username: str
    password: str

@router.post("/login")
def login(user: UserLogin):
    # Placeholder for JWT generation
    if user.username == "admin" and user.password == "admin":
        return {"access_token": "fake-jwt-token-admin", "token_type": "bearer"}
    elif user.username == "voter" and user.password == "voter":
        return {"access_token": "fake-jwt-token-voter", "token_type": "bearer"}
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect username or password",
        headers={"WWW-Authenticate": "Bearer"},
    )
