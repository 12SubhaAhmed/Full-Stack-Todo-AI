"use client";

import { useRouter } from "next/navigation";
import { useEffect, useCallback, useState } from "react"; // Added useState for local task state management
import { useAuth } from "@/context/AuthContext";

import Header from "@/components/Header";
import AddTaskForm from "@/components/AddTaskForm";
import TaskList from "@/components/TaskList";
import { Task } from "@/components/TaskList"; // Import Task type
import ChatBot from "@/components/chatbot";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, token } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]); // State to manage tasks locally
  const [tasksLoading, setTasksLoading] = useState(true); // Loading state for tasks

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

  const fetchTasks = useCallback(async () => {
    if (!user?.id || !token) {
      setTasksLoading(false);
      return;
    }
    setTasksLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/${user.id}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data: Task[] = await response.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setTasksLoading(false);
    }
  }, [user?.id, token]);

  useEffect(() => {
    if (isAuthenticated && user?.id && token) {
      fetchTasks();
    }
  }, [isAuthenticated, user?.id, token, fetchTasks]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || tasksLoading) { // Check both auth loading and tasks loading
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-700 text-lg">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-700 text-lg">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col relative overflow-hidden">
      {/* Neon glowing effect background */}
      <div className="absolute inset-0 z-0 opacity-10" style={{
        background: 'radial-gradient(circle at 15% 50%, #8A2BE2 0%, transparent 50%), radial-gradient(circle at 85% 50%, #4B0082 0%, transparent 50%), radial-gradient(circle at 50% 100%, #6A0DAD 0%, transparent 50%)',
      }}></div>

      <Header />
      <main className="grow container mx-auto p-4 flex flex-col items-center relative z-10">
        <div className="w-full max-w-3xl bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-purple-500/30">
          <h1 className="text-4xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-pink-500">
            {user?.name ? `${user.name.toUpperCase()}'S TASKS` : "YOUR TASKS"}
          </h1>
          <AddTaskForm userId={user?.id} token={token} onTaskAdded={fetchTasks} />
          <div className="mt-8">
            <TaskList userId={user?.id} token={token} tasks={tasks} onTaskUpdated={fetchTasks} />
          </div>
        </div>
      </main>
      <ChatBot onTaskMutation={fetchTasks} />
    </div>
  );
}
