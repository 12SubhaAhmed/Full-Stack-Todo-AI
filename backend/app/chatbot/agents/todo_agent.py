from sqlmodel import Session
from uuid import UUID
from app.chatbot.mcp import tools
import re

def run_agent(db: Session, user_id: UUID, message: str):
    text = message.lower().strip()
    tool_calls = []

    # 0. Greetings
    if text in ["hi", "hello", "hey", "sup", "greetings", "help"]:
        return "Hey! I'm your task buddy. I'm simple:\n- Just type anything to **add** it.\n- Say **'done 1'** or **'check milk'** to complete.\n- Say **'delete 1'** or **'remove milk'** to delete.\n- Say **'list'** to see everything.", tool_calls

    # Ordinal mapping (words and numbers)
    ordinals = {
        "first": 0, "second": 1, "third": 2, "fourth": 3, "fifth": 4,
        "1": 0, "2": 1, "3": 2, "4": 3, "5": 4, "6": 5, "7": 6, "8": 7, "9": 8, "10": 9
    }

    # 1. List Tasks
    if text in ["list", "show", "tasks", "show tasks", "what are my tasks"]:
        tasks = tools.list_tasks(db, user_id)
        tool_calls.append("list_tasks")
        if not tasks:
            return "Your list is empty! Type something to add a task. 📝", tool_calls
        return "Here are your tasks:\n" + "\n".join(
            f"{i+1}. {t.title} [{'✓' if t.is_completed else ' '}]" for i, t in enumerate(tasks)
        ), tool_calls

    # 2. Complete Task
    complete_keywords = ["done", "complete", "finish", "check", "did", "checked"]
    if any(text.startswith(kw) for kw in complete_keywords):
        # Extract everything after the keyword
        parts = text.split(maxsplit=1)
        target = parts[1] if len(parts) > 1 else ""
        
        if not target:
             return "Which task is done? (e.g., 'done 1' or 'done Buy milk')", tool_calls
        
        target_title = target
        if target in ordinals:
            tasks = tools.list_tasks(db, user_id)
            idx = ordinals[target]
            if idx < len(tasks):
                target_title = tasks[idx].title
        
        try:
            tools.complete_task(db, user_id, target_title)
            tool_calls.append("complete_task")
            return f"Nice! '{target_title}' is marked as done. ✅", tool_calls
        except ValueError:
             return f"Couldn't find task '{target}'", tool_calls

    # 3. Delete Task
    delete_keywords = ["delete", "remove", "cancel", "clear", "rm", "erase"]
    if any(text.startswith(kw) for kw in delete_keywords):
        parts = text.split(maxsplit=1)
        target = parts[1] if len(parts) > 1 else ""
        
        if not target:
             return "Which task should I delete? (e.g., 'delete 1')", tool_calls

        target_title = target
        if target in ordinals:
            tasks = tools.list_tasks(db, user_id)
            idx = ordinals[target]
            if idx < len(tasks):
                target_title = tasks[idx].title

        try:
            tools.delete_task(db, user_id, target_title)
            tool_calls.append("delete_task")
            return f"Deleted: '{target_title}' 🗑️", tool_calls
        except ValueError:
             return f"Couldn't find task '{target}' to delete.", tool_calls

    # 4. Default: Add Task
    # If it's not a command, treat it as a new task
    # (But ignore very short messages that might be noise)
    if len(text) > 1:
        # Clean up common prefixes if user still uses them
        title = re.sub(r"^(add|create|remember|remind me to|new task)\s+", "", text, flags=re.IGNORECASE)
        task = tools.add_task(db, user_id, title.capitalize())
        tool_calls.append("add_task")
        return f"Got it! Added: '{task.title}'", tool_calls

    return "I didn't catch that. Try saying 'list' or just type a new task!", tool_calls