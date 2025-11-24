import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Profile from './components/Profile.jsx';
import api from './utils/api';
import './App.css';

function TaskManager() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('general');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState(null);
  const [currentView, setCurrentView] = useState('tasks');
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  );

  const { user, logout } = useAuth();

  // Dark Mode Effect
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const fetchAllTasks = async () => {
    try {
      let url = '/tasks';
      const params = new URLSearchParams();
      
      if (filter !== 'all') params.append('status', filter);
      if (searchTerm) params.append('search', searchTerm);
      
      if (params.toString()) url += `?${params.toString()}`;

      console.log('📋 Fetching tasks...');

      const response = await api.get(url);
      console.log('✅ Tasks loaded:', response.data);
      
      // Ensure data is an array
      if (Array.isArray(response.data)) {
        setTasks(response.data);
      } else {
        console.error('❌ Tasks data is not an array:', response.data);
        setTasks([]);
      }
    } catch (error) {
      console.error('❌ Error fetching tasks:', error);
      setTasks([]);
    }
  };

  const fetchStats = async () => {
    try {
      console.log('📊 Fetching stats...');
      
      const response = await api.get('/tasks/stats/summary');
      console.log('✅ Stats loaded:', response.data);
      setStats(response.data);
    } catch (error) {
      console.error('❌ Error fetching stats:', error);
      setStats(null);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      alert('Please fill in required fields');
      return;
    }

    try {
      const response = await api.post('/tasks', { 
        title, 
        description, 
        priority, 
        category, 
        dueDate: dueDate || null,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : []
      });

      if (response.status === 201) {
        resetForm();
        fetchAllTasks();
        fetchStats();
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Error creating task');
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await api.delete(`/tasks/${id}`);
      fetchAllTasks();
      fetchStats();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Error deleting task');
    }
  };

  const toggleComplete = async (task) => {
    try {
      await api.put(`/tasks/${task._id}`, {
        ...task,
        completed: !task.completed
      });

      fetchAllTasks();
      fetchStats();
    } catch (error) {
      console.error('Error toggling task:', error);
      alert('Error updating task');
    }
  };

  const editTask = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setCategory(task.category);
    setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
    setTags(task.tags ? task.tags.join(', ') : '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateTask = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      alert('Please fill in required fields');
      return;
    }

    try {
      await api.put(`/tasks/${editingTask._id}`, {
        title,
        description,
        priority,
        category,
        dueDate: dueDate || null,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        completed: editingTask.completed
      });

      resetForm();
      fetchAllTasks();
      fetchStats();
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Error updating task');
    }
  };

  // Duplicate Task Function
  const duplicateTask = async (taskId) => {
    try {
      await api.post(`/tasks/${taskId}/duplicate`);
      fetchAllTasks();
      fetchStats();
      alert('Task duplicated successfully!');
    } catch (error) {
      console.error('Error duplicating task:', error);
      alert('Error duplicating task');
    }
  };

  // Export Tasks Function
  const exportTasks = async () => {
    try {
      const response = await api.get('/tasks/export/json');
      const blob = new Blob([JSON.stringify(response.data, null, 2)], 
        { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tasks-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      alert('Tasks exported successfully!');
    } catch (error) {
      console.error('Error exporting tasks:', error);
      alert('Error exporting tasks');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory('general');
    setDueDate('');
    setTags('');
    setEditingTask(null);
  };

  useEffect(() => {
    if (currentView === 'tasks') {
      fetchAllTasks();
      fetchStats();
    }
  }, [filter, searchTerm, currentView]);

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#ff4757';
      case 'medium': return '#ffa502';
      case 'low': return '#1e90ff';
      default: return '#888';
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>📋 Task Manager</h1>
        <nav className="nav-menu">
          <button 
            className={`nav-btn ${currentView === 'tasks' ? 'active' : ''}`}
            onClick={() => setCurrentView('tasks')}
          >
            📝 Tasks
          </button>
          <button 
            className={`nav-btn ${currentView === 'profile' ? 'active' : ''}`}
            onClick={() => setCurrentView('profile')}
          >
            👤 Profile
          </button>
        </nav>
        <div className="user-info">
          <span>Welcome, {user?.username}! 👋</span>
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className="btn btn-theme-toggle"
            title="Toggle Dark Mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button onClick={logout} className="btn btn-logout">Logout</button>
        </div>
      </header>

      <div className="container">
        {currentView === 'profile' ? (
          <Profile />
        ) : (
          <>
            {/* Statistics Dashboard */}
            {stats && (
              <div className="stats-dashboard">
                <div className="stat-card">
                  <div className="stat-icon">📊</div>
                  <h3>Total Tasks</h3>
                  <p className="stat-number">{stats.totalTasks}</p>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⚡</div>
                  <h3>Active Tasks</h3>
                  <p className="stat-number">{stats.activeTasks}</p>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <h3>Completed</h3>
                  <p className="stat-number">{stats.completedTasks}</p>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📈</div>
                  <h3>Completion Rate</h3>
                  <p className="stat-number">
                    {stats.totalTasks > 0 
                      ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
                      : 0}%
                  </p>
                </div>
              </div>
            )}

            {/* Export Button */}
            <div className="action-buttons">
              <button onClick={exportTasks} className="btn btn-export">
                📥 Export Tasks
              </button>
            </div>

            {/* Task Form */}
            <div className="task-form-container">
              <h2>{editingTask ? '✏️ Edit Task' : '➕ Create New Task'}</h2>
              <form onSubmit={editingTask ? updateTask : createTask} className="task-form">
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Task Title *"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-field"
                    required
                  />
                  <select 
                    value={priority} 
                    onChange={(e) => setPriority(e.target.value)}
                    className="input-field"
                  >
                    <option value="low">🟢 Low Priority</option>
                    <option value="medium">🟡 Medium Priority</option>
                    <option value="high">🔴 High Priority</option>
                  </select>
                </div>

                <textarea
                  placeholder="Task Description *"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  className="input-field"
                  required
                />

                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Category (e.g., Work, Personal)"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="date"
                    placeholder="Due Date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="input-field"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Tags (comma separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="input-field"
                />

                <div className="button-group">
                  <button type="submit" className="btn btn-primary">
                    {editingTask ? '💾 Update Task' : '➕ Add Task'}
                  </button>
                  {editingTask && (
                    <button type="button" onClick={resetForm} className="btn btn-secondary">
                      ❌ Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Filters and Search */}
            <div className="filters-container">
              <div className="filter-buttons">
                <button 
                  className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  📋 All Tasks
                </button>
                <button 
                  className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
                  onClick={() => setFilter('active')}
                >
                  ⚡ Active
                </button>
                <button 
                  className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                  onClick={() => setFilter('completed')}
                >
                  ✅ Completed
                </button>
              </div>
              <input
                type="text"
                placeholder="🔍 Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            {/* Tasks List */}
            <div className="tasks-container">
              <h2>📝 Your Tasks ({tasks.length})</h2>
              {tasks.length === 0 ? (
                <div className="no-tasks">
                  <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <p>No tasks found. Create your first task!</p>
                  </div>
                </div>
              ) : (
                <div className="tasks-list">
                  {tasks.map((task) => (
                    <div key={task._id} className={`task-card ${task.completed ? 'completed' : ''}`}>
                      <div className="task-header">
                        <h3 className="task-title">{task.title}</h3>
                        <span 
                          className="priority-badge"
                          style={{ backgroundColor: getPriorityColor(task.priority) }}
                        >
                          {task.priority === 'high' && '🔴'}
                          {task.priority === 'medium' && '🟡'}
                          {task.priority === 'low' && '🟢'}
                          {' '}{task.priority}
                        </span>
                      </div>
                      
                      <p className="task-description">{task.description}</p>
                      
                      <div className="task-meta">
                        <span className="task-category">📁 {task.category}</span>
                        {task.dueDate && (
                          <span className="task-due-date">
                            📅 {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {task.tags && task.tags.length > 0 && (
                        <div className="task-tags">
                          {task.tags.map((tag, index) => (
                            <span key={index} className="tag">🏷️ {tag}</span>
                          ))}
                        </div>
                      )}

                      <p className="task-date">
                        🕒 Created: {new Date(task.createdAt).toLocaleDateString()}
                      </p>

                      <div className="task-actions">
                        <button onClick={() => toggleComplete(task)} className="btn btn-toggle">
                          {task.completed ? '↩️ Undo' : '✓ Complete'}
                        </button>
                        <button onClick={() => editTask(task)} className="btn btn-edit">
                          ✏️ Edit
                        </button>
                        <button 
                          onClick={() => duplicateTask(task._id)} 
                          className="btn btn-duplicate"
                          title="Duplicate Task"
                        >
                          📋 Duplicate
                        </button>
                        <button onClick={() => deleteTask(task._id)} className="btn btn-delete">
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function App() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <AuthProvider>
      <AppContent showLogin={showLogin} setShowLogin={setShowLogin} />
    </AuthProvider>
  );
}

function AppContent({ showLogin, setShowLogin }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return showLogin ? (
      <Login onSwitchToRegister={() => setShowLogin(false)} />
    ) : (
      <Register onSwitchToLogin={() => setShowLogin(true)} />
    );
  }

  return <TaskManager />;
}

export default App;