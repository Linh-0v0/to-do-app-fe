import React, { useState } from "react";
import { Task, RepeatType } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";
import { useTaskStore } from "@/lib/store/taskStore";
import { Check, Calendar, Star, Trash } from "lucide-react";

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
    deleteTask(task.id);
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
