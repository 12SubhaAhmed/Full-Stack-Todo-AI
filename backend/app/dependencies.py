from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session
from typing import Annotated
from uuid import UUID

from .auth_utils import verify_jwt_token
from .database import get_session
from .models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/token")


async def get_current_active_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    session: Annotated[Session, Depends(get_session)]
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = verify_jwt_token(token)

        user_id_str = payload.get("sub")
        if not user_id_str:
            raise credentials_exception

        user_id = UUID(user_id_str)

        user = session.get(User, user_id)
        if not user:
            raise credentials_exception

        return user

    except Exception:
        raise credentials_exception