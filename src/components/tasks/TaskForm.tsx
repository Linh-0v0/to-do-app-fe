import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Task, RepeatType, TaskFormInputs } from "@/lib/types";
import { useTaskStore } from "@/lib/store/taskStore";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Calendar, Clock, RotateCcw, Star } from "lucide-react";

interface TaskFormProps {
  initialData?: Partial<Task>;
  onSuccess?: () => void;
  onCancel?: () => void;
}

// Zod schema for task form validation
const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.boolean().default(false),
  priority: z.number().min(0).max(3).default(0),
  dueDate: z.union([z.date(), z.string()]).optional(),
  reminder: z.union([z.date(), z.string()]).optional(),
  repeatType: z.nativeEnum(RepeatType).default(RepeatType.NONE),
});

export const TaskForm: React.FC<TaskFormProps> = ({
  initialData,
  onSuccess,
  onCancel,
}) => {
  const { createTask, updateTask } = useTaskStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!initialData?.id;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TaskFormInputs>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      status: initialData?.status || false,
      priority: initialData?.priority || 0,
      dueDate: initialData?.dueDate,
      reminder: initialData?.reminder,
      repeatType: initialData?.repeatType || RepeatType.NONE,
    },
  });

  const priority = watch("priority");
  const repeatType = watch("repeatType");

  const onSubmit = async (data: TaskFormInputs) => {
    setIsLoading(true);
    setError(null);

    try {
      if (isEditing && initialData.id) {
        await updateTask(initialData.id, data);
      } else {
        await createTask(data);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save task");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePriority = () => {
    const newPriority = priority === 0 ? 1 : 0;
    setValue("priority", newPriority);
  };

  const handleRepeatChange = (newRepeatType: RepeatType) => {
    setValue("repeatType", newRepeatType);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Input
          placeholder="Task title"
          {...register("title")}
          className={`text-lg font-medium ${
            errors.title ? "border-destructive" : ""
          }`}
          aria-label="Task title"
        />
        {errors.title && (
          <p className="text-destructive text-xs">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Input
          placeholder="Description (optional)"
          {...register("description")}
          className="text-sm"
          aria-label="Task description"
        />
      </div>

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <div className="flex items-center">
          <Input
            type="datetime-local"
            {...register("dueDate")}
            className="w-full text-sm"
            aria-label="Due date"
          />
          <Calendar className="h-4 w-4 -ml-8 text-muted-foreground" />
        </div>

        <div className="flex items-center">
          <Input
            type="datetime-local"
            {...register("reminder")}
            className="w-full text-sm"
            aria-label="Set reminder"
          />
          <Clock className="h-4 w-4 -ml-8 text-muted-foreground" />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button
            type="button"
            variant={priority > 0 ? "default" : "outline"}
            size="sm"
            onClick={togglePriority}
            className={priority > 0 ? "bg-primary" : ""}
          >
            <Star
              className={`h-4 w-4 mr-1 ${priority > 0 ? "fill-white" : ""}`}
            />
            Priority
          </Button>

          <div className="relative">
            <Button
              type="button"
              variant={repeatType !== RepeatType.NONE ? "default" : "outline"}
              size="sm"
              onClick={() => {
                // Toggle between NONE and DAILY
                handleRepeatChange(
                  repeatType === RepeatType.NONE
                    ? RepeatType.DAILY
                    : RepeatType.NONE
                );
              }}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              {repeatType === RepeatType.NONE
                ? "Repeat"
                : repeatType === RepeatType.DAILY
                ? "Daily"
                : repeatType === RepeatType.WEEKLY
                ? "Weekly"
                : repeatType === RepeatType.MONTHLY
                ? "Monthly"
                : "Yearly"}
            </Button>

            {repeatType !== RepeatType.NONE && (
              <div className="absolute top-full left-0 mt-1 p-1 bg-background border rounded-md shadow-md z-10">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start mb-1 ${
                    repeatType === RepeatType.DAILY ? "bg-secondary" : ""
                  }`}
                  onClick={() => handleRepeatChange(RepeatType.DAILY)}
                >
                  Daily
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start mb-1 ${
                    repeatType === RepeatType.WEEKLY ? "bg-secondary" : ""
                  }`}
                  onClick={() => handleRepeatChange(RepeatType.WEEKLY)}
                >
                  Weekly
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start mb-1 ${
                    repeatType === RepeatType.MONTHLY ? "bg-secondary" : ""
                  }`}
                  onClick={() => handleRepeatChange(RepeatType.MONTHLY)}
                >
                  Monthly
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={`w-full justify-start ${
                    repeatType === RepeatType.YEARLY ? "bg-secondary" : ""
                  }`}
                  onClick={() => handleRepeatChange(RepeatType.YEARLY)}
                >
                  Yearly
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : isEditing ? "Update Task" : "Add Task"}
          </Button>
        </div>
      </div>
    </form>
  );
};
