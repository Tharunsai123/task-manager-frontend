import { createContext, useState, useContext } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { AuthContext } from './AuthContext';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    completed: '',
    priority: '',
    category: '',
    search: '',
    sort: '-createdAt'
  });
  
  const { user } = useContext(AuthContext);

  // Fetch Tasks
  const fetchTasks = async () => {
    if (!user) {
      setTasks([]);
      return;
    }
    
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });
      
      const { data } = await API.get(`/tasks?${queryParams}`);
      setTasks(data.tasks || []);
    } catch (error) {
      console.error('Fetch tasks error:', error);
      toast.error('Failed to fetch tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Statistics
  const fetchStats = async () => {
    if (!user) {
      setStats(null);
      return;
    }
    
    try {
      const { data } = await API.get('/tasks/stats');
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setStats({
        overview: {
          total: 0,
          completed: 0,
          pending: 0,
          highPriority: 0,
          mediumPriority: 0,
          lowPriority: 0
        },
        categories: []
      });
    }
  };

  // Create Task
  const createTask = async (taskData) => {
    try {
      const { data } = await API.post('/tasks', taskData);
      setTasks([data, ...tasks]);
      toast.success('Task created successfully!');
      fetchStats();
      return { success: true, data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create task';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Update Task
  const updateTask = async (id, taskData) => {
    try {
      const { data } = await API.put(`/tasks/${id}`, taskData);
      setTasks(tasks.map(task => task._id === id ? data : task));
      toast.success('Task updated successfully!');
      fetchStats();
      return { success: true, data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update task';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
      toast.success('Task deleted successfully!');
      fetchStats();
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete task';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Toggle Complete
  const toggleComplete = async (task) => {
    try {
      const { data } = await API.put(`/tasks/${task._id}`, {
        ...task,
        completed: !task.completed
      });
      setTasks(tasks.map(t => t._id === task._id ? data : t));
      fetchStats();
      return { success: true };
    } catch (error) {
      toast.error('Failed to update task');
      return { success: false };
    }
  };

  const value = {
    tasks,
    stats,
    loading,
    filters,
    setFilters,
    fetchTasks,
    fetchStats,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};