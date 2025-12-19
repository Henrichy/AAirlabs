import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { Task } from "./types";
import * as store from "./taskStorage";
import { splitIntoTasks } from "../voice/split";

type TasksContextType = {
  tasks: Task[];
  loadTasks: () => Promise<void>;
  addTask: (title: string, description?: string, dueDate?: number) => void;
  addTasks: (input: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
};

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load tasks on mount
  useEffect(() => {
    store.loadTasks().then(setTasks);
  }, []);

  const loadTasks = useCallback(async () => {
    const t = await store.loadTasks();
    setTasks(t);
  }, []);

  const persist = useCallback(async (next: Task[]) => {
    setTasks(next);
    await store.saveTasks(next);
  }, []);

  const addTask = useCallback(
    (title: string, description?: string, dueDate?: number) => {
      const task: Task = {
        id: Math.random().toString(36).slice(2),
        title,
        description,
        completed: false,
        createdAt: Date.now(),
        dueDate
      };
      persist([task, ...tasks]);
    },
    [persist, tasks]
  );

  const addTasks = useCallback(
    (input: string) => {
      const titles = splitIntoTasks(input);
      if (titles.length === 0) return;
      
      const created = titles.map((t) => ({
        id: Math.random().toString(36).slice(2),
        title: t,
        completed: false,
        createdAt: Date.now()
      })) as Task[];
      persist([...created, ...tasks]);
    },
    [persist, tasks]
  );

  const toggleTask = useCallback(
    (id: string) => {
      const next = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
      persist(next);
    },
    [persist, tasks]
  );

  const deleteTask = useCallback(
    (id: string) => {
      const next = tasks.filter((t) => t.id !== id);
      persist(next);
    },
    [persist, tasks]
  );

  const value = useMemo(
    () => ({ tasks, loadTasks, addTask, addTasks, toggleTask, deleteTask }),
    [tasks, loadTasks, addTask, addTasks, toggleTask, deleteTask]
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
}
