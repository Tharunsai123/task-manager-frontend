import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // State Management
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // API Base URL
  const API = 'https://task-manager-backend-d3hb.onrender.com/api/tasks';

  // Fetch all tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // FETCH all tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(API);
      const data = await response.json();
      setTasks(data);
      setError('');
    } catch (error) {
      setError('Error fetching tasks');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // CREATE new task
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
      });

      if (response.ok) {
        setTitle('');
        setDescription('');
        fetchTasks();
        setError('');
      }
    } catch (error) {
      setError('Error creating task');
      console.error('Error:', error);
    }
  };

  // UPDATE task
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API}/${editingTask._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          description, 
          completed: editingTask.completed 
        })
      });

      if (response.ok) {
        setTitle('');
        setDescription('');
        setEditingTask(null);
        fetchTasks();
        setError('');
      }
    } catch (error) {
      setError('Error updating task');
      console.error('Error:', error);
    }
  };

  // DELETE task
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await fetch(`${API}/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          fetchTasks();
          setError('');
        }
      } catch (error) {
        setError('Error deleting task');
        console.error('Error:', error);
      }
    }
  };

  // TOGGLE task completion
  const toggleComplete = async (task) => {
    try {
      const response = await fetch(`${API}/${task._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...task, 
          completed: !task.completed 
        })
      });

      if (response.ok) {
        fetchTasks();
        setError('');
      }
    } catch (error) {
      setError('Error updating task');
      console.error('Error:', error);
    }
  };

  // Start editing
  const startEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="app">
      <div className="container">
        <h1>📝 Task Manager</h1>

        {/* Error Message */}
        {error && <div className="error">{error}</div>}

        {/* Task Form */}
        <form onSubmit={editingTask ? handleUpdate : handleSubmit} className="task-form">
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="3"
          />
          <div className="form-buttons">
            <button type="submit" className="btn-primary">
              {editingTask ? '✏️ Update Task' : '➕ Add Task'}
            </button>
            {editingTask && (
              <button type="button" onClick={cancelEdit} className="btn-secondary">
                ❌ Cancel
              </button>
            )}
          </div>
        </form>

        {/* Loading State */}
        {loading && <p className="loading">Loading tasks...</p>}

        {/* Tasks List */}
        <div className="tasks-list">
          <h2>Your Tasks ({tasks.length})</h2>
          {tasks.length === 0 ? (
            <p className="no-tasks">No tasks yet. Add one to get started! 🚀</p>
          ) : (
            tasks.map((task) => (
              <div key={task._id} className={`task-card ${task.completed ? 'completed' : ''}`}>
                <div className="task-content">
                  <div className="task-header">
                    <h3>{task.title}</h3>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleComplete(task)}
                      className="checkbox"
                    />
                  </div>
                  <p>{task.description}</p>
                  <small className="task-date">
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                  </small>
                </div>
                <div className="task-actions">
                  <button onClick={() => startEdit(task)} className="btn-edit">
                    ✏️ Edit
                  </button>
                  <button onClick={() => handleDelete(task._id)} className="btn-delete">
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;