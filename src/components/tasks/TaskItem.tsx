import React from "react";
import { Task, RepeatType } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";
import { useTaskStore } from "@/lib/store/taskStore";
import { Button } from "../ui/button";
import { Check, Clock, Trash2, Star, Calendar } from "lucide-react";

interface TaskItemProps {
  task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { toggleTaskStatus, deleteTask } = useTaskStore();

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

  return (
    <div
      className={`p-4 border rounded-lg mb-3 transition-colors ${
        task.status ? "bg-muted" : "bg-card"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <button
            onClick={() => toggleTaskStatus(task.id)}
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
              task.status
                ? "bg-primary border-primary text-primary-foreground"
                : "border-primary"
            }`}
            aria-label={task.status ? "Mark as incomplete" : "Mark as complete"}
          >
            {task.status && <Check className="h-4 w-4" />}
          </button>

          <div className="flex-1 space-y-1">
            <div className="flex items-center">
              <h3
                className={`font-medium ${
                  task.status ? "line-through text-muted-foreground" : ""
                }`}
              >
                {task.title}
              </h3>
              {task.priority > 0 && (
                <Star className="ml-2 h-4 w-4 fill-primary text-primary" />
              )}
            </div>

            {task.description && (
              <p
                className={`text-sm ${
                  task.status ? "text-muted-foreground" : "text-foreground"
                }`}
              >
                {task.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-2">
              {task.dueDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Due: {formatDateTime(task.dueDate)}</span>
                </div>
              )}

              {task.reminder && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Reminder: {formatDateTime(task.reminder)}</span>
                </div>
              )}

              {task.repeatType !== RepeatType.NONE && (
                <div className="flex items-center gap-1 bg-secondary/50 px-2 py-0.5 rounded-full">
                  <span>Repeats: {getRepeatLabel(task.repeatType)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteTask(task.id)}
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          aria-label="Delete task"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
