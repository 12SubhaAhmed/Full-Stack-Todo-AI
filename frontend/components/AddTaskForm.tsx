"use client";

import { useState } from "react";
import { NEXT_PUBLIC_API_BASE_URL } from "next/dist/build/swc";

interface AddTaskFormProps {
  userId: string | undefined;
  token: string | null;
  onTaskAdded: () => void; // Callback to refresh tasks
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function AddTaskForm({ userId, token, onTaskAdded }: AddTaskFormProps) {
  const [taskTitle, setTaskTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      setError("Task title cannot be empty.");
      return;
    }
    if (!userId || !token) {
      setError("User not authenticated.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/${userId}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: taskTitle }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to add task");
      }

      setTaskTitle("");
      onTaskAdded(); // Refresh the task list
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      console.error("Error adding task:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-6">
      <input
        type="text"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        placeholder="Add a new task..."
        className="flex-grow px-4 py-3 bg-gray-800/50 text-white placeholder-gray-500 border border-purple-500/30 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition duration-200 ease-in-out text-base"
        disabled={isSubmitting}
      />
      <button
        type="submit"
        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Adding..." : "Add Task"}
      </button>
      {error && <p className="text-sm text-red-400 mt-2 font-medium">{error}</p>}
    </form>
  );
}
