import { useState, useContext, useEffect } from 'react';
import { TaskContext } from '../../context/TaskContext';
import { PRIORITIES, CATEGORIES } from '../../utils/constants';
import './TaskForm.css';

const TaskForm = ({ editingTask, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'other',
    dueDate: '',
    tags: '',
    notes: ''
  });

  const { createTask, updateTask } = useContext(TaskContext);

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
        category: editingTask.category,
        dueDate: editingTask.dueDate ? editingTask.dueDate.split('T')[0] : '',
        tags: editingTask.tags ? editingTask.tags.join(', ') : '',
        notes: editingTask.notes || ''
      });
    }
  }, [editingTask]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    if (editingTask) {
      await updateTask(editingTask._id, taskData);
    } else {
      await createTask(taskData);
    }

    onClose();
  };

  return (
    <div className="task-form-container">
      <h2>{editingTask ? '✏️ Edit Task' : '➕ Create New Task'}</h2>
      
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title">Task Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your task"
            rows="3"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              {PRIORITIES.map(p => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags (comma separated)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g. urgent, meeting, review"
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Additional Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any additional information"
            rows="3"
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-submit">
            {editingTask ? 'Update Task' : 'Create Task'}
          </button>
          <button type="button" onClick={onClose} className="btn-cancel">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;