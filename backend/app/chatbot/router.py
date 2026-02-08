from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from ..database import get_session
from ..models import User
from ..dependencies import get_current_active_user
from .schemas.chat import ChatRequest, ChatResponse
from .services.chat_service import handle_chat

router = APIRouter(prefix="/api/chatbot", tags=["chatbot"])

@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    current_user: Annotated[User, Depends(get_current_active_user)],
    session: Annotated[Session, Depends(get_session)]
):
    try:
        return handle_chat(
            db=session,
            user_id=current_user.id,
            payload=request
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
