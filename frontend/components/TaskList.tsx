"use client";

import TaskItem from "./TaskItem";

export type Task = {
  id: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  owner_id: string;
};

interface TaskListProps {
  userId: string | undefined;
  token: string | null;
  tasks: Task[]; // Now accepts tasks as a prop
  onTaskUpdated: () => void; // Callback for when a task is updated/deleted
}

export default function TaskList({ userId, token, tasks, onTaskUpdated }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="py-10 text-center">
        <div className="inline-block p-4 rounded-full bg-purple-500/10 mb-4">
          <svg className="w-12 h-12 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-gray-400 text-lg">No tasks found. Time to add some goals!</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <TaskItem 
          key={task.id} 
          task={task} 
          userId={userId} 
          token={token} 
          onTaskUpdated={onTaskUpdated} 
        />
      ))}
    </ul>
  );
}