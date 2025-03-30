import { create } from "zustand";
import { Task, RepeatType } from "../types";
import { taskService } from "../services/taskService";

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
}

interface TaskActions {
  // Task CRUD operations
  fetchTasks: () => Promise<void>;
  getTask: (id: string) => Task | undefined;
  createTask: (task: Omit<Task, "id" | "userId">) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  // Task status management
  toggleTaskStatus: (id: string) => Promise<void>;

  // State management
  setTasks: (tasks: Task[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

type TaskStore = TaskState & TaskActions;

export const useTaskStore = create<TaskStore>((set, get) => ({
  // Initial state
  tasks: [],
  isLoading: false,
  error: null,

  // Task CRUD operations
  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await taskService.getTasks();
      set({ tasks, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch tasks",
        isLoading: false,
      });
    }
  },

  getTask: (id: string) => {
    return get().tasks.find((task) => task.id === id);
  },

  createTask: async (task: Omit<Task, "id" | "userId">) => {
    set({ isLoading: true, error: null });
    try {
      const createdTask = await taskService.createTask(task);
      set({
        tasks: [...get().tasks, createdTask],
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to create task",
        isLoading: false,
      });
      throw error;
    }
  },

  updateTask: async (id: string, taskUpdate: Partial<Task>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedTask = await taskService.updateTask(id, taskUpdate);

      // Update task in state
      set({
        tasks: get().tasks.map((task) =>
          task.id === id ? updatedTask : task
        ),
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update task",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteTask: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await taskService.deleteTask(id);

      // Remove task from state
      set({
        tasks: get().tasks.filter((task) => task.id !== id),
        isLoading: false,
      });
    } catch (error) {
      console.error("Error deleting task:", error);

      let errorMessage = "Failed to delete task";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === 'object' && 'response' in error) {
        // Handle axios error
        const axiosError = error as any;
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        } else if (axiosError.response?.statusText) {
          errorMessage = `Server error: ${axiosError.response.statusText}`;
        }
      }

      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  // Task status management
  toggleTaskStatus: async (id: string) => {
    const task = get().tasks.find((task) => task.id === id);
    if (!task) {
      set({ error: "Task not found" });
      return;
    }

    await get().updateTask(id, { status: !task.status });
  },

  // State management
  setTasks: (tasks) => set({ tasks }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
