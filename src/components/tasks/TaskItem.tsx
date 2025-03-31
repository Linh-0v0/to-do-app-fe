import React, { useState } from "react";
import { Task, RepeatType } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";
import { useTaskStore } from "@/lib/store/taskStore";
import { Check, Calendar, Star, Trash, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface TaskItemProps {
  task: Task;
  viewMode: "grid" | "list";
  onEditTask: (taskId: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  viewMode,
  onEditTask,
}) => {
  const { toggleTaskStatus, updateTask, deleteTask } = useTaskStore();
  const [isHovering, setIsHovering] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const getRepeatLabel = (repeatType: RepeatType): string => {
    switch (repeatType) {
      case RepeatType.DAILY:
        return "Daily";
      case RepeatType.WEEKLY:
        return "Weekly";
      case RepeatType.MONTHLY:
        return "Monthly";
      case RepeatType.YEARLY:
        return "Yearly";
      default:
        return "";
    }
  };

  const togglePriority = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedTask = {
      ...task,
      priority: task.priority > 0 ? 0 : 1,
    };
    updateTask(task.id, updatedTask);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteTask(task.id);
      setShowDeleteConfirm(false);
      toast.success(`Task "${task.title}" deleted successfully`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete task";
      setDeleteError(errorMessage);
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
    setDeleteError(null);
  };

  const renderDeleteConfirmation = () => {
    return (
      <div
        className="absolute inset-0 bg-black/20 flex items-center justify-center z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white p-4 rounded-lg shadow-lg max-w-xs w-full">
          <h3 className="font-medium mb-2">Delete Task</h3>
          <p className="text-sm text-gray-600 mb-4">
            Are you sure you want to delete "{task.title}"?
          </p>

          {deleteError && (
            <div className="mb-4 p-2 bg-red-50 text-red-600 text-sm rounded-md flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{deleteError}</span>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={cancelDelete}
              className="px-3 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-3 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (viewMode === "list") {
    return (
      <div
        className={`flex items-center gap-4 p-4 bg-white rounded-lg border relative ${
          isHovering ? "shadow-md" : ""
        }`}
        onClick={() => onEditTask(task.id)}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {showDeleteConfirm && renderDeleteConfirmation()}
        {isHovering && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-l-lg"></div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleTaskStatus(task.id);
          }}
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
            task.status ? "bg-orange-500 border-orange-500" : "border-gray-300"
          } ${isHovering ? "hover:bg-gray-100" : ""}`}
        >
          {task.status && <Check className="h-3 w-3 text-white" />}
        </button>

        <div className="flex-grow">
          <h3 className={task.status ? "text-gray-400 line-through" : ""}>
            {task.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>
              {task.dueDate ? formatDateTime(task.dueDate) : "No due date"}
            </span>
            {task.repeatType !== RepeatType.NONE && (
              <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                {getRepeatLabel(task.repeatType)}
              </span>
            )}
          </div>
        </div>

        <button
          className={`mr-3 ${isHovering ? "scale-110" : ""}`}
          onClick={togglePriority}
        >
          <Star
            className={`h-5 w-5 ${
              task.priority > 0
                ? "fill-orange-500 text-orange-500"
                : `text-gray-300 ${isHovering ? "hover:text-gray-400" : ""}`
            }`}
          />
        </button>

        <button
          className={`text-gray-400 ${
            isHovering ? "text-red-500 scale-110" : ""
          }`}
          onClick={handleDeleteClick}
        >
          <Trash className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`p-4 bg-white rounded-lg border relative ${
        isHovering ? "shadow-md" : ""
      }`}
      onClick={() => onEditTask(task.id)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {showDeleteConfirm && renderDeleteConfirmation()}
      <div className="flex items-start gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleTaskStatus(task.id);
          }}
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
            task.status ? "bg-orange-500 border-orange-500" : "border-gray-300"
          } ${isHovering ? "hover:bg-gray-100" : ""}`}
        >
          {task.status && <Check className="h-3 w-3 text-white" />}
        </button>

        <div className="flex-grow">
          <h3 className={task.status ? "text-gray-400 line-through" : ""}>
            {task.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
            <Calendar className="h-4 w-4" />
            <span>
              {task.dueDate ? formatDateTime(task.dueDate) : "No due date"}
            </span>
          </div>
          {task.repeatType !== RepeatType.NONE && (
            <span className="inline-block px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-500 mt-2">
              {getRepeatLabel(task.repeatType)}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={(e) => togglePriority(e)}
            className={isHovering ? "scale-110" : ""}
          >
            <Star
              className={`h-5 w-5 ${
                task.priority > 0
                  ? "fill-orange-500 text-orange-500"
                  : `text-gray-300 ${isHovering ? "hover:text-gray-400" : ""}`
              }`}
            />
          </button>

          <button
            className={`text-gray-400 ${
              isHovering ? "text-red-500 scale-110" : ""
            }`}
            onClick={handleDeleteClick}
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
