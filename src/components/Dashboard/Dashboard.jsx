import { useContext, useEffect, useState } from 'react';
import { TaskContext } from '../../context/TaskContext';
import { AuthContext } from '../../context/AuthContext';
import TaskForm from '../Tasks/TaskForm';
import TaskList from '../Tasks/TaskList';
import TaskFilter from '../Tasks/TaskFilter';
import Statistics from './Statistics';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { fetchTasks, fetchStats, stats } = useContext(TaskContext);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    if (user) {  // ✅ Only fetch if user exists
      fetchTasks();
      fetchStats();
    }
  }, [user]);

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  if (!user) {
    return (
      <div className="dashboard">
        <div className="dashboard-container">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, {user?.name}! 👋</h1>
            <p>Here's what's happening with your tasks today</p>
          </div>
          <button 
            className="btn-add-task"
            onClick={() => setShowForm(true)}
          >
            ➕ Add New Task
          </button>
        </div>

        {/* Statistics Section - only show if stats exist */}
        {stats && <Statistics stats={stats} />}

        {/* Task Filter */}
        <TaskFilter />

        {/* Task Form Modal */}
        {showForm && (
          <div className="modal-overlay" onClick={handleCloseForm}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={handleCloseForm}>
                ✕
              </button>
              <TaskForm 
                editingTask={editingTask} 
                onClose={handleCloseForm} 
              />
            </div>
          </div>
        )}

        {/* Task List */}
        <TaskList onEdit={handleEdit} />
      </div>
    </div>
  );
};

export default Dashboard;