import { useContext } from 'react';
import { TaskContext } from '../../context/TaskContext';
import { PRIORITIES, CATEGORIES } from '../../utils/constants';
import { format } from 'date-fns';
import './TaskItem.css';

const TaskItem = ({ task, onEdit }) => {
  const { toggleComplete, deleteTask } = useContext(TaskContext);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(task._id);
    }
  };

  const getPriorityColor = () => {
    const priority = PRIORITIES.find(p => p.value === task.priority);
    return priority ? priority.color : '#6c757d';
  };

  const getCategoryInfo = () => {
    const category = CATEGORIES.find(c => c.value === task.category);
    return category || { label: '📌 Other', color: '#6c757d' };
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}>
      {/* Priority Indicator */}
      <div 
        className="priority-indicator" 
        style={{ backgroundColor: getPriorityColor() }}
      />

      {/* Task Header */}
      <div className="task-item-header">
        <div className="task-checkbox">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleComplete(task)}
            id={`task-${task._id}`}
          />
          <label htmlFor={`task-${task._id}`}></label>
        </div>
        
        <div className="task-content">
          <h4>{task.title}</h4>
          <p>{task.description}</p>
        </div>
      </div>

      {/* Task Meta Info */}
      <div className="task-meta">
        <span className="task-category" style={{ color: getCategoryInfo().color }}>
          {getCategoryInfo().label}
        </span>
        
        <span className="task-priority" style={{ color: getPriorityColor() }}>
          {task.priority.toUpperCase()}
        </span>

        {task.dueDate && (
          <span className={`task-due-date ${isOverdue ? 'overdue-text' : ''}`}>
            📅 {format(new Date(task.dueDate), 'MMM dd, yyyy')}
          </span>
        )}
      </div>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="task-tags">
          {task.tags.map((tag, index) => (
            <span key={index} className="task-tag">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Notes */}
      {task.notes && (
        <div className="task-notes">
          <small>📝 {task.notes}</small>
        </div>
      )}

      {/* Task Actions */}
      <div className="task-actions">
        <button 
          onClick={() => onEdit(task)} 
          className="btn-action btn-edit"
          title="Edit Task"
        >
          ✏️ Edit
        </button>
        <button 
          onClick={handleDelete} 
          className="btn-action btn-delete"
          title="Delete Task"
        >
          🗑️ Delete
        </button>
      </div>

      {/* Created Date */}
      <div className="task-footer">
        <small>Created: {format(new Date(task.createdAt), 'MMM dd, yyyy HH:mm')}</small>
      </div>
    </div>
  );
};

export default TaskItem;