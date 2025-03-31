import apiClient from "../api/apiClient";
import { Task, ApiResponse } from "../types";

export const taskService = {
    // Fetch all tasks for the current user
    async getTasks(): Promise<Task[]> {
        const response = await apiClient.get<Task[]>("/tasks");
        return response.data;
    },

    // Get a single task by ID
    async getTask(taskId: string): Promise<Task> {
        const response = await apiClient.get<Task>(`/tasks/${taskId}`);
        return response.data;
    },

    // Create a new task
    async createTask(taskData: Omit<Task, "id" | "userId">): Promise<Task> {
        const response = await apiClient.post<Task>("/tasks", taskData);
        return response.data;
    },

    // Update an existing task
    async updateTask(taskId: string, taskData: Partial<Task>): Promise<Task> {
        const response = await apiClient.patch<Task>(`/tasks/${taskId}`, taskData);
        return response.data;
    },

    // Delete a task
    async deleteTask(taskId: string): Promise<void> {
        try {
            await apiClient.delete(`/tasks/${taskId}`);
            console.log(`Task ${taskId} deleted successfully`);
        } catch (error) {
            console.error(`Error deleting task ${taskId}:`, error);
            throw error; // Re-throw to be handled by the caller
        }
    },
}; 