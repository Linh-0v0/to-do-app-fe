import React, { useState, useRef } from "react";
import { TaskList } from "@/components/tasks/TaskList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Calendar,
  Bell,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useTaskStore } from "@/lib/store/taskStore";
import { RepeatType } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

const TaskListPage: React.FC = () => {
  const { tasks, createTask } = useTaskStore();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [showDueDate, setShowDueDate] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [showRepeatOptions, setShowRepeatOptions] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState("10:00 AM");
  const [repeatOption, setRepeatOption] = useState("Not repeat");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dueDateSelected, setDueDateSelected] = useState<Date | null>(null);
  const [reminderSelected, setReminderSelected] = useState<Date | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Calculate task completion
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status).length;
  const progressPercentage =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const repeatOptions = ["Not repeat", "Daily", "Weekly", "Monthly", "Yearly"];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // Reset form fields
  const resetTaskForm = () => {
    setTaskTitle("");
    setTaskDescription("");
    setShowDueDate(false);
    setShowReminder(false);
    setShowRepeatOptions(false);
    setRepeatOption("Not repeat");
    setSelectedDate(new Date());
    setSelectedTime("10:00 AM");
    setDueDateSelected(null);
    setReminderSelected(null);
  };

  const handleAddTaskClick = () => {
    setIsAddingTask(true);
    // Use setTimeout to ensure the DOM has updated before focusing
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const toggleDueDate = () => {
    setShowDueDate(!showDueDate);
    setShowReminder(false);
    setShowRepeatOptions(false);
  };

  const toggleReminder = () => {
    setShowReminder(!showReminder);
    setShowDueDate(false);
    setShowRepeatOptions(false);
  };

  const toggleRepeatOptions = () => {
    setShowRepeatOptions(!showRepeatOptions);
    setShowDueDate(false);
    setShowReminder(false);
  };

  const handleRepeatOptionSelect = (option: string) => {
    setRepeatOption(option);
    setShowRepeatOptions(false);
  };

  const handlePrevMonth = () => {
    const date = new Date(selectedDate);
    date.setMonth(date.getMonth() - 1);
    setSelectedDate(date);
  };

  const handleNextMonth = () => {
    const date = new Date(selectedDate);
    date.setMonth(date.getMonth() + 1);
    setSelectedDate(date);
  };

  const getDaysInMonth = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    // Get the first day of the month
    const firstDay = new Date(year, month, 1).getDay();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const formatMonth = () => {
    return `${months[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
  };

  const handleDateSelection = (day: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(day);
    setSelectedDate(newDate);
  };

  const clearDueDate = () => {
    setDueDateSelected(null);
  };

  const clearReminder = () => {
    setReminderSelected(null);
  };

  const handleCreateTask = async () => {
    if (!taskTitle.trim()) {
      return; // Don't create empty tasks
    }

    setIsLoading(true);
    setError(null);

    try {
      // Map the repeat option string to RepeatType enum
      let repeatType = RepeatType.NONE;
      switch (repeatOption) {
        case "Daily":
          repeatType = RepeatType.DAILY;
          break;
        case "Weekly":
          repeatType = RepeatType.WEEKLY;
          break;
        case "Monthly":
          repeatType = RepeatType.MONTHLY;
          break;
        case "Yearly":
          repeatType = RepeatType.YEARLY;
          break;
      }

      // Format dates as ISO strings with Z suffix to indicate UTC
      const formattedDueDate = dueDateSelected ? dueDateSelected.toISOString() : undefined;
      const formattedReminder = reminderSelected ? reminderSelected.toISOString() : undefined;

      // Create the task with the form data using ISO strings with Z suffix
      await createTask({
        title: taskTitle,
        description: taskDescription,
        status: false,
        priority: 0,
        dueDate: formattedDueDate,
        reminder: formattedReminder,
        repeatType,
      });

      // Reset form and close
      resetTaskForm();
      setIsAddingTask(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to convert 12-hour time to 24-hour format
  const convertTimeStringTo24Hour = (timeStr: string): string => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') {
      hours = '00';
    }
    
    if (modifier === 'PM') {
      hours = (parseInt(hours, 10) + 12).toString();
    }
    
    return `${hours}:${minutes}`;
  };

  const saveDateTime = (isForDueDate: boolean) => {
    // Parse the time string and apply it to the selected date
    const [hours, minutes] = selectedTime.includes('AM') || selectedTime.includes('PM') 
      ? convertTimeStringTo24Hour(selectedTime).split(':')
      : selectedTime.split(':');
    
    const dateTime = new Date(selectedDate);
    dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    if (isForDueDate) {
      setDueDateSelected(dateTime);
      setShowDueDate(false);
    } else {
      setReminderSelected(dateTime);
      setShowReminder(false);
    }
  };

  const renderCalendar = (isForDueDate: boolean) => {
    const days = getDaysInMonth();
    const today = new Date();
    const isCurrentMonth =
      today.getMonth() === selectedDate.getMonth() &&
      today.getFullYear() === selectedDate.getFullYear();
    const currentDay = today.getDate();

    // Calculate selected day if a date is selected
    const selectedDay = selectedDate ? selectedDate.getDate() : null;

    return (
      <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-4 z-10 w-72">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handlePrevMonth}
            className="text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="font-medium">{formatMonth()}</div>
          <button
            onClick={handleNextMonth}
            className="text-gray-500 hover:text-gray-700"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-xs text-center text-gray-500">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <div
              key={index}
              onClick={() => day && handleDateSelection(day)}
              className={`
                h-8 w-8 flex items-center justify-center rounded-full text-sm 
                ${!day ? "invisible" : "cursor-pointer"}
                ${day && day === selectedDay ? "bg-orange-500 text-white" : ""}
                ${day && day !== selectedDay ? "hover:bg-gray-100" : ""}
              `}
            >
              {day}
            </div>
          ))}
        </div>

        <input
          type="time"
          className="mt-4 p-2 border rounded w-full"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
        />

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => {
              if (isForDueDate) {
                setShowDueDate(false);
              } else {
                setShowReminder(false);
              }
            }}
            className="py-2 w-1/2 rounded text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => saveDateTime(isForDueDate)}
            className="py-2 w-1/2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {!isAddingTask ? (
        <div
          onClick={handleAddTaskClick}
          className="w-full max-w-xl mx-auto p-4 rounded-lg border border-dashed border-gray-300 hover:border-gray-400 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2 text-gray-500">
            <Plus className="h-5 w-5" />
            <span>Add task...</span>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-xl mx-auto p-4 rounded-lg border bg-gray-50">
          <Input
            ref={inputRef}
            placeholder="Add task..."
            className="mb-2 bg-white"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
          <Input 
            placeholder="Description" 
            className="mb-2 bg-white" 
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
          
          {/* Display selected dates and times */}
          <div className="mb-3 flex flex-wrap gap-2">
            {dueDateSelected && (
              <div className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                <Calendar className="h-3 w-3" />
                <span>{formatDateTime(dueDateSelected)}</span>
                <button 
                  onClick={clearDueDate}
                  className="ml-1 text-blue-700 hover:text-blue-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            
            {reminderSelected && (
              <div className="flex items-center gap-1 text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full">
                <Bell className="h-3 w-3" />
                <span>{formatDateTime(reminderSelected)}</span>
                <button 
                  onClick={clearReminder}
                  className="ml-1 text-yellow-700 hover:text-yellow-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDueDate}
                className={showDueDate ? "bg-gray-200" : ""}
              >
                <Calendar className="h-5 w-5 text-gray-500" />
              </Button>
              {showDueDate && renderCalendar(true)}
            </div>
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleReminder}
                className={showReminder ? "bg-gray-200" : ""}
              >
                <Bell className="h-5 w-5 text-gray-500" />
              </Button>
              {showReminder && renderCalendar(false)}
            </div>
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleRepeatOptions}
                className={showRepeatOptions ? "bg-gray-200" : ""}
              >
                <RotateCcw className="h-5 w-5 text-gray-500" />
              </Button>
              {showRepeatOptions && (
                <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-10 w-48">
                  {repeatOptions.map((option) => (
                    <div
                      key={option}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleRepeatOptionSelect(option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex-grow" />
            <Button
              variant="ghost"
              onClick={() => {
                resetTaskForm();
                setIsAddingTask(false);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateTask}
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Enter"}
            </Button>
          </div>
          {error && (
            <div className="mt-2 p-2 rounded-md bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}
        </div>
      )}

      <TaskList />

      {/* Progress Indicator */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-full border shadow-lg">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <img src="/icons/logo.svg" alt="Logo" className="w-8 h-8" />
          </div>
          <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="text-base font-medium">
            {completedTasks}/{totalTasks}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskListPage;
