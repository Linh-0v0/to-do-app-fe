import React, { useEffect, useState } from "react";
import { useTaskStore } from "@/lib/store/taskStore";
import { TaskItem } from "./TaskItem";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Search, Plus, SlidersHorizontal } from "lucide-react";
import { TaskForm } from "./TaskForm";
import { Task } from "@/lib/types";

interface FilterOption {
  label: string;
  value: "all" | "active" | "completed" | "priority";
}

const filterOptions: FilterOption[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
  { label: "Priority", value: "priority" },
];

export const TaskList: React.FC = () => {
  const { tasks, isLoading, error, fetchTasks } = useTaskStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] =
    useState<FilterOption["value"]>("all");
  const [showTaskForm, setShowTaskForm] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = tasks.filter((task) => {
    // First apply the search filter
    const matchesSearch =
      searchTerm === "" ||
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description &&
        task.description.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    // Then apply the status/priority filter
    switch (activeFilter) {
      case "active":
        return !task.status;
      case "completed":
        return task.status;
      case "priority":
        return task.priority > 0;
      default:
        return true;
    }
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // First sort by status (incomplete first)
    if (a.status !== b.status) {
      return a.status ? 1 : -1;
    }

    // Then by priority (high to low)
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }

    // Then by due date (closest first)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }

    if (a.dueDate) return -1;
    if (b.dueDate) return 1;

    // Finally by title
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Button onClick={() => setShowTaskForm(!showTaskForm)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Task
        </Button>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 text-destructive">
          {error}
        </div>
      )}

      {showTaskForm && (
        <div className="p-4 border rounded-lg mb-4">
          <TaskForm
            onSuccess={() => setShowTaskForm(false)}
            onCancel={() => setShowTaskForm(false)}
          />
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>

        <div className="flex overflow-x-auto p-1 -mx-1 space-x-1">
          {filterOptions.map((option) => (
            <Button
              key={option.value}
              variant={activeFilter === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(option.value)}
              className="whitespace-nowrap"
            >
              {option.label}
            </Button>
          ))}

          <Button variant="ghost" size="sm" className="ml-auto">
            <SlidersHorizontal className="h-4 w-4 mr-1" />
            Sort
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-muted-foreground">
          Loading tasks...
        </div>
      ) : sortedTasks.length > 0 ? (
        <div className="space-y-2 mt-4">
          {sortedTasks.map((task: Task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-muted-foreground">
          {searchTerm
            ? "No tasks match your search"
            : "No tasks found. Add your first task!"}
        </div>
      )}
    </div>
  );
};
