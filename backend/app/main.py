from datetime import timedelta
from typing import List, Annotated
from uuid import UUID

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from contextlib import asynccontextmanager
from pydantic import BaseModel, Field

from .database import create_db_and_tables, get_session
from .models import User, Task
from .dependencies import get_current_active_user
from .auth_utils import verify_password, get_password_hash, create_access_token
from .chatbot.router import router as chatbot_router

# ---------------- SCHEMAS ----------------

class UserCreate(BaseModel):
    name: str
    email: str
    password: str = Field(max_length=70)


class UserResponse(BaseModel):
    id: UUID
    name: str
    email: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    is_completed: bool | None = None


# ---------------- APP LIFESPAN ----------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(
    title="Todo App Backend",
    lifespan=lifespan
)

# ---------------- CORS (IMPORTANT) ----------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chatbot_router)


# ---------------- ROOT ----------------

@app.get("/")
async def root():
    return {"message": "API running successfully"}


# ---------------- REGISTER ----------------

@app.post(
    "/api/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
async def register_user(
    user_create: UserCreate,
    session: Annotated[Session, Depends(get_session)]
):
    existing_user = session.exec(
        select(User).where(User.email == user_create.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    user = User(
        name=user_create.name,
        email=user_create.email,
        hashed_password=get_password_hash(user_create.password)
    )

    session.add(user)
    session.commit()
    session.refresh(user)

    return user


# ---------------- LOGIN ----------------

@app.post("/api/token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: Annotated[Session, Depends(get_session)]
):
    user = session.exec(
        select(User).where(User.email == form_data.username)
    ).first()

    if not user or not verify_password(
        form_data.password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )

    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "name": user.name,
            "email": user.email
        },
        expires_delta=timedelta(minutes=30)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# ---------------- TASKS ----------------

@app.get("/api/{user_id}/tasks", response_model=List[Task])
async def get_tasks(
    user_id: UUID,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    if user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not allowed"
        )

    return session.exec(
        select(Task).where(Task.owner_id == user_id)
    ).all()


@app.post(
    "/api/{user_id}/tasks",
    response_model=Task,
    status_code=status.HTTP_201_CREATED
)
async def create_task(
    user_id: UUID,
    task: Task,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    if user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not allowed"
        )

    task.owner_id = user_id
    session.add(task)
    session.commit()
    session.refresh(task)

    return task


@app.patch("/api/{user_id}/tasks/{task_id}", response_model=Task)
async def update_task(
    user_id: UUID,
    task_id: UUID,
    task_update: TaskUpdate,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    if user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not allowed"
        )

    db_task = session.get(Task, task_id)
    if not db_task or db_task.owner_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    task_data = task_update.model_dump(exclude_unset=True)
    for key, value in task_data.items():
        setattr(db_task, key, value)

    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task


@app.delete("/api/{user_id}/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    user_id: UUID,
    task_id: UUID,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    if user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not allowed"
        )

    db_task = session.get(Task, task_id)
    if not db_task or db_task.owner_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    session.delete(db_task)
    session.commit()
    return None