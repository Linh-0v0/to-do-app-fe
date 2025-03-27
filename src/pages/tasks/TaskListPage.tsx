import React from "react";
import { TaskList } from "@/components/tasks/TaskList";

const TaskListPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <TaskList />
    </div>
  );
};

export default TaskListPage;
