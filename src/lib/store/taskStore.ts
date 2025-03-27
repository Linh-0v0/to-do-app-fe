import { create } from "zustand";
import { Task, RepeatType } from "../types";

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
      // Mock implementation - replace with actual API call
      // const response = await api.get('/tasks');
      // const { tasks } = response.data;

      // Simulate fetching tasks
      const mockTasks: Task[] = [
        {
          id: "1",
          userId: "1",
          title: "Complete project documentation",
          description:
            "Write comprehensive documentation for the API endpoints",
          status: false,
          priority: 2,
          dueDate: new Date(Date.now() + 86400000 * 3), // 3 days from now
          reminder: new Date(Date.now() + 86400000 * 2), // 2 days from now
          repeatType: RepeatType.NONE,
        },
        {
          id: "2",
          userId: "1",
          title: "Weekly team meeting",
          description: "Discuss project progress and blockers",
          status: false,
          priority: 1,
          dueDate: new Date(Date.now() + 86400000), // 1 day from now
          reminder: new Date(Date.now() + 86400000 - 3600000), // 1 hour before due date
          repeatType: RepeatType.WEEKLY,
        },
      ];

      set({ tasks: mockTasks, isLoading: false });
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
      // Mock implementation - replace with actual API call
      // const response = await api.post('/tasks', task);
      // const { createdTask } = response.data;

      // Simulate creating a task
      const mockCreatedTask: Task = {
        id: Date.now().toString(),
        userId: "1", // Use actual user ID from auth store in real implementation
        ...task,
      };

      set({
        tasks: [...get().tasks, mockCreatedTask],
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to create task",
        isLoading: false,
      });
    }
  },

  updateTask: async (id: string, taskUpdate: Partial<Task>) => {
    set({ isLoading: true, error: null });
    try {
      // Mock implementation - replace with actual API call
      // await api.patch(`/tasks/${id}`, taskUpdate);

      // Update task in state
      set({
        tasks: get().tasks.map((task) =>
          task.id === id ? { ...task, ...taskUpdate } : task
        ),
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update task",
        isLoading: false,
      });
    }
  },

  deleteTask: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // Mock implementation - replace with actual API call
      // await api.delete(`/tasks/${id}`);

      // Remove task from state
      set({
        tasks: get().tasks.filter((task) => task.id !== id),
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete task",
        isLoading: false,
      });
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
