from sqlmodel import Session, select
from datetime import datetime
from uuid import UUID
from app.models import Task

def add_task(db: Session, user_id: UUID, title: str):
    task = Task(owner_id=user_id, title=title)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

def list_tasks(db: Session, user_id: UUID):
    statement = select(Task).where(Task.owner_id == user_id)
    return db.exec(statement).all()

def complete_task(db: Session, user_id: UUID, task_title: str):
    # Find task by title for now since agent extracts title
    statement = select(Task).where(Task.owner_id == user_id, Task.title.ilike(f"%{task_title}%"))
    task = db.exec(statement).first()
    
    if not task:
        raise ValueError("Task not found")

    task.is_completed = True
    # task.updated_at = datetime.utcnow() # Task model doesn't have updated_at yet, skip for now
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

def delete_task(db: Session, user_id: UUID, task_title: str):
    statement = select(Task).where(Task.owner_id == user_id, Task.title.ilike(f"%{task_title}%"))
    task = db.exec(statement).first()
    
    if not task:
        raise ValueError("Task not found")

    db.delete(task)
    db.commit()
    return task
