import React, { useEffect, useState } from "react";
import { useTaskStore } from "@/lib/store/taskStore";
import { TaskItem } from "./TaskItem";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Search,
  LayoutGrid,
  List,
  Calendar,
  Bell,
  RotateCcw,
  Star,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Task, RepeatType } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

interface FilterOption {
  label: string;
  value: "all" | "completed" | "pending" | "priority";
}

const filterOptions: FilterOption[] = [
  { label: "All", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Pending", value: "pending" },
  { label: "Priority", value: "priority" },
];

const repeatOptions = ["Not repeat", "Daily", "Weekly", "Monthly", "Yearly"];

export const TaskList: React.FC = () => {
  const { tasks, isLoading, error, fetchTasks, updateTask, toggleTaskStatus } =
    useTaskStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] =
    useState<FilterOption["value"]>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Edit task modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [showDueDate, setShowDueDate] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [showRepeatOptions, setShowRepeatOptions] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [selectedRepeat, setSelectedRepeat] = useState<string>("Not repeat");

  // Calendar state
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState("10:00 AM");
  const [currentDueDate, setCurrentDueDate] = useState<Date | null>(null);
  const [currentReminder, setCurrentReminder] = useState<Date | null>(null);

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

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    if (currentTask) {
      setEditedTitle(currentTask.title);
      setEditedDescription(currentTask.description || "");
      setCurrentDueDate(
        currentTask.dueDate ? new Date(currentTask.dueDate) : null
      );
      setCurrentReminder(
        currentTask.reminder ? new Date(currentTask.reminder) : null
      );

      if (currentTask.dueDate) {
        setSelectedDate(new Date(currentTask.dueDate));
      } else {
        setSelectedDate(new Date());
      }

      // Set repeat option based on current task
      if (currentTask.repeatType === RepeatType.DAILY) {
        setSelectedRepeat("Daily");
      } else if (currentTask.repeatType === RepeatType.WEEKLY) {
        setSelectedRepeat("Weekly");
      } else if (currentTask.repeatType === RepeatType.MONTHLY) {
        setSelectedRepeat("Monthly");
      } else if (currentTask.repeatType === RepeatType.YEARLY) {
        setSelectedRepeat("Yearly");
      } else {
        setSelectedRepeat("Not repeat");
      }
    }
  }, [currentTask]);

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
      case "completed":
        return task.status;
      case "pending":
        return !task.status;
      case "priority":
        return task.priority > 0;
      default:
        return true;
    }
  });

  const handleEditTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setCurrentTask(task);
      setEditModalOpen(true);
    }
  };

  const handleSaveTask = () => {
    if (!currentTask) return;

    let repeatType = RepeatType.NONE;
    switch (selectedRepeat) {
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
      default:
        repeatType = RepeatType.NONE;
    }

    const updatedTask = {
      ...currentTask,
      title: editedTitle,
      description: editedDescription,
      repeatType,
      dueDate: currentDueDate || undefined,
      reminder: currentReminder || undefined,
    };

    updateTask(currentTask.id, updatedTask);
    setEditModalOpen(false);
    setCurrentTask(null);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setCurrentTask(null);
    setShowDueDate(false);
    setShowReminder(false);
    setShowRepeatOptions(false);
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

  const handleRepeatSelect = (option: string) => {
    setSelectedRepeat(option);
    setShowRepeatOptions(false);
  };

  const toggleTaskPriority = () => {
    if (!currentTask) return;

    const updatedTask = {
      ...currentTask,
      priority: currentTask.priority > 0 ? 0 : 1,
    };

    updateTask(currentTask.id, updatedTask);

    // Update current task in state to reflect the change immediately
    setCurrentTask({
      ...currentTask,
      priority: currentTask.priority > 0 ? 0 : 1,
    });
  };

  // Calendar helpers
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

  const saveDueDate = () => {
    const dateWithTime = new Date(selectedDate);
    let [hours, minutes] = ["12", "00"];
    let isPM = false;

    if (selectedTime) {
      const timeMatch = selectedTime.match(/(\d+):(\d+)\s*([AP]M)?/i);
      if (timeMatch) {
        hours = timeMatch[1];
        minutes = timeMatch[2];
        isPM = timeMatch[3]?.toUpperCase() === "PM";
      }
    }

    let hour = parseInt(hours, 10);
    if (isPM && hour !== 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;

    dateWithTime.setHours(hour, parseInt(minutes, 10), 0);
    setCurrentDueDate(dateWithTime);
    setShowDueDate(false);
  };

  const saveReminder = () => {
    const dateWithTime = new Date(selectedDate);
    let [hours, minutes] = ["12", "00"];
    let isPM = false;

    if (selectedTime) {
      const timeMatch = selectedTime.match(/(\d+):(\d+)\s*([AP]M)?/i);
      if (timeMatch) {
        hours = timeMatch[1];
        minutes = timeMatch[2];
        isPM = timeMatch[3]?.toUpperCase() === "PM";
      }
    }

    let hour = parseInt(hours, 10);
    if (isPM && hour !== 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;

    dateWithTime.setHours(hour, parseInt(minutes, 10), 0);
    setCurrentReminder(dateWithTime);
    setShowReminder(false);
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
      <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-4 z-50 w-72">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handlePrevMonth}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1 rounded-full transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="font-medium">{formatMonth()}</div>
          <button
            onClick={handleNextMonth}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1 rounded-full transition-colors"
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
          className="mt-4 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
        />

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => {
              if (isForDueDate) {
                setCurrentDueDate(null);
              } else {
                setCurrentReminder(null);
              }
              setShowDueDate(false);
              setShowReminder(false);
            }}
            className="py-2 w-1/2 rounded text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={isForDueDate ? saveDueDate : saveReminder}
            className="py-2 w-1/2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Tasks</h2>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          {filterOptions.map((option) => (
            <Button
              key={option.value}
              variant={activeFilter === option.value ? "default" : "outline"}
              onClick={() => setActiveFilter(option.value)}
              className={
                activeFilter === option.value
                  ? "bg-orange-500 hover:bg-orange-600 transition-colors"
                  : "hover:bg-gray-100 transition-colors"
              }
            >
              {option.label}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="hover:bg-gray-100 transition-colors"
          >
            {viewMode === "grid" ? (
              <List className="h-4 w-4" />
            ) : (
              <LayoutGrid className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 text-destructive">
          {error}
        </div>
      )}

      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            : "space-y-4"
        }
      >
        {filteredTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            viewMode={viewMode}
            onEditTask={handleEditTask}
          />
        ))}
      </div>

      {/* Edit Task Modal */}
      {editModalOpen && currentTask && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeEditModal}
        >
          <div
            className="bg-gray-50 rounded-lg w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h3 className="text-xl font-medium mb-6">Edit Task</h3>

              <div className="bg-white rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <button
                    onClick={() => {
                      if (currentTask) {
                        toggleTaskStatus(currentTask.id);
                        setCurrentTask({
                          ...currentTask,
                          status: !currentTask.status,
                        });
                      }
                    }}
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border hover:bg-gray-100 transition-colors ${
                      currentTask.status
                        ? "bg-orange-500 border-orange-500"
                        : "border-gray-300"
                    }`}
                  >
                    {currentTask.status && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </button>
                  <input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="flex-1 text-base border-none focus:outline-none focus:ring-2 focus:ring-orange-500 rounded p-1 bg-transparent"
                    placeholder="Clean the room"
                  />
                  <button
                    onClick={toggleTaskPriority}
                    className="hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`h-5 w-5 ${
                        currentTask.priority > 0
                          ? "fill-orange-500 text-orange-500"
                          : "text-gray-300 hover:text-gray-400"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 mb-2 hover:shadow-sm transition-shadow">
                <div className="relative">
                  <div className="flex items-center gap-3 py-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <button
                      className="text-gray-500 hover:text-gray-700 text-left w-full hover:underline hover:font-medium transition-colors"
                      onClick={toggleDueDate}
                    >
                      {currentDueDate
                        ? formatDateTime(currentDueDate)
                        : "Add due date"}
                    </button>
                  </div>
                  {showDueDate && renderCalendar(true)}
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 mb-2 hover:shadow-sm transition-shadow">
                <div className="relative">
                  <div className="flex items-center gap-3 py-2">
                    <Bell className="h-5 w-5 text-gray-500" />
                    <button
                      className="text-gray-500 hover:text-gray-700 text-left w-full hover:underline hover:font-medium transition-colors"
                      onClick={toggleReminder}
                    >
                      {currentReminder
                        ? formatDateTime(currentReminder)
                        : "Remind me"}
                    </button>
                  </div>
                  {showReminder && renderCalendar(false)}
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 mb-6 hover:shadow-sm transition-shadow">
                <div className="relative">
                  <div className="flex items-center gap-3 py-2">
                    <RotateCcw className="h-5 w-5 text-gray-500" />
                    <button
                      className="text-gray-500 hover:text-gray-700 text-left w-full hover:underline hover:font-medium transition-colors"
                      onClick={toggleRepeatOptions}
                    >
                      {selectedRepeat}
                    </button>
                  </div>
                  {showRepeatOptions && (
                    <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-50 w-48">
                      {repeatOptions.map((option) => (
                        <div
                          key={option}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                          onClick={() => handleRepeatSelect(option)}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 mb-6">
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  placeholder="Description"
                  className="w-full border-none focus:outline-none focus:ring-2 focus:ring-orange-500 rounded resize-none bg-transparent min-h-[60px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="secondary"
                  onClick={closeEditModal}
                  className="py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-700 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveTask}
                  className="py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white transition-colors"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
