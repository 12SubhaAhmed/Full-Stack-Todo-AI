from sqlmodel import Session
from uuid import UUID
from app.chatbot.schemas.chat import ChatRequest, ChatResponse
from app.chatbot.models.conversation import Conversation
from app.chatbot.models.message import Message
from app.chatbot.agents.todo_agent import run_agent

def handle_chat(db: Session, user_id: UUID, payload: ChatRequest):

    # conversation
    if payload.conversation_id:
        convo = db.get(Conversation, payload.conversation_id)
        if not convo or convo.user_id != user_id:
             # Fallback or error handling
             convo = Conversation(user_id=user_id)
             db.add(convo)
             db.commit()
             db.refresh(convo)
    else:
        convo = Conversation(user_id=user_id)
        db.add(convo)
        db.commit()
        db.refresh(convo)

    # save user message
    db.add(Message(
        user_id=user_id,
        conversation_id=convo.id,
        role="user",
        content=payload.message
    ))
    db.commit()

    # agent
    response_text, tool_calls = run_agent(db, user_id, payload.message)

    # save assistant message
    db.add(Message(
        user_id=user_id,
        conversation_id=convo.id,
        role="assistant",
        content=response_text
    ))
    db.commit()

    return ChatResponse(
        conversation_id=convo.id,
        response=response_text,
        tool_calls=tool_calls
    )
