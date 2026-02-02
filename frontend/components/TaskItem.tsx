"use client";

import { useState } from "react";
import type { Task } from "./TaskList";

interface TaskItemProps {
  task: Task;
  userId: string | undefined;
  token: string | null;
  onTaskUpdated: () => void; // Callback to refresh tasks
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function TaskItem({ task, userId, token, onTaskUpdated }: TaskItemProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleToggleComplete = async () => {
    if (!userId || !token) return;
    setIsProcessing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/${userId}/tasks/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_completed: !task.is_completed }),
      });

      if (!response.ok) throw new Error("Failed to update task");
      onTaskUpdated();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!userId || !token) return;
    if (!confirm("Are you sure you want to delete this task?")) return;
    setIsProcessing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/${userId}/tasks/${task.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete task");
      onTaskUpdated();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateTitle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !token || !editTitle.trim() || editTitle === task.title) {
      setIsEditing(false);
      return;
    }
    setIsProcessing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/${userId}/tasks/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: editTitle }),
      });

      if (!response.ok) throw new Error("Failed to update task title");
      setIsEditing(false);
      onTaskUpdated();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <li className="flex items-center justify-between p-4 bg-gray-800/40 border border-purple-500/20 rounded-xl hover:border-purple-500/50 transition duration-300 group backdrop-blur-sm shadow-lg">
      <div className="flex items-center flex-grow mr-4">
        <button
          onClick={handleToggleComplete}
          disabled={isProcessing}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            task.is_completed
              ? "bg-purple-600 border-purple-600"
              : "border-purple-400 hover:border-pink-500"
          }`}
        >
          {task.is_completed && (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {isEditing ? (
          <form onSubmit={handleUpdateTitle} className="flex-grow ml-4">
            <input
              autoFocus
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={() => !isProcessing && setIsEditing(false)}
              className="w-full bg-gray-700 text-white px-2 py-1 rounded border border-purple-500 outline-none"
            />
          </form>
        ) : (
          <span
            className={`ml-4 text-lg font-medium transition-all ${
              task.is_completed ? "line-through text-gray-500" : "text-gray-200"
            }`}
          >
            {task.title}
          </span>
        )}
      </div>

      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-colors"
            title="Edit task"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        )}
        <button
          onClick={handleDelete}
          className="p-2 text-pink-500 hover:text-pink-400 hover:bg-pink-500/10 rounded-lg transition-colors"
          title="Delete task"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      {error && <p className="text-xs text-red-400 absolute -bottom-5 left-4">{error}</p>}
    </li>
  );
}
