import { useContext, useEffect } from 'react';
import { TaskContext } from '../../context/TaskContext';
import TaskItem from './TaskItem';
import './TaskList.css';

const TaskList = ({ onEdit }) => {
  const { tasks, loading, fetchTasks, filters } = useContext(TaskContext);

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading tasks...</p>
      </div>
    );
  }

  // ✅ Safety check - ensure tasks is an array
  if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <h3>No tasks found</h3>
        <p>Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h3>Your Tasks ({tasks.length})</h3>
      </div>
      <div className="task-grid">
        {tasks.map((task) => (
          <TaskItem key={task._id} task={task} onEdit={onEdit} />
        ))}
      </div>
    </div>
  );
};

export default TaskList;