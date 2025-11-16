import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  const API = 'http://localhost:5000/api/tasks';

  const fetchAllTasks = async () => {
    try {
      const response = await fetch(API);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    
    if (!title || !description) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });

      if (response.ok) {
        setTitle('');
        setDescription('');
        fetchAllTasks();
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      const response = await fetch(`${API}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchAllTasks();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const toggleComplete = async (task) => {
    try {
      const response = await fetch(`${API}/${task._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          completed: !task.completed
        }),
      });

      if (response.ok) {
        fetchAllTasks();
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const editTask = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
  };

  const updateTask = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`${API}/${editingTask._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          completed: editingTask.completed
        }),
      });

      if (response.ok) {
        setTitle('');
        setDescription('');
        setEditingTask(null);
        fetchAllTasks();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <h1>Task Manager</h1>
        
        <form onSubmit={editingTask ? updateTask : createTask} className="task-form">
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
          />
          <textarea
            placeholder="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="input-field"
          />
          <div className="button-group">
            <button type="submit" className="btn btn-primary">
              {editingTask ? 'Update Task' : 'Add Task'}
            </button>
            {editingTask && (
              <button type="button" onClick={cancelEdit} className="btn btn-secondary">
              Cancel
              </button>
            )}
          </div>
        </form>

        <div className="tasks-container">
          <h2>All Tasks ({tasks.length})</h2>
          {tasks.length === 0 ? (
            <p className="no-tasks">No tasks yet.</p>
          ) : (
            <div className="tasks-list">
              {tasks.map((task) => (
                <div key={task._id} className={`task-card ${task.completed ? 'completed' : ''}`}>
                  <div className="task-content">
                    <h3 className="task-title">{task.title}</h3>
                    <p className="task-description">{task.description}</p>
                    <p className="task-date">
                      Created: {new Date(task.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="task-actions">
                    <button onClick={() => toggleComplete(task)} className="btn btn-toggle">
                      {task.completed ? 'Undo' : 'Complete'}
                    </button>
                    <button onClick={() => editTask(task)} className="btn btn-edit">
                      Edit
                    </button>
                    <button onClick={() => deleteTask(task._id)} className="btn btn-delete">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;