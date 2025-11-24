import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Notifications.css';

function Notifications() {
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const { token } = useAuth();

  const API = 'https://task-manager-backend-d3hb.onrender.com/api/tasks';

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // Fetch upcoming tasks
      const upcomingResponse = await fetch(`${API}/upcoming/today`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const upcomingData = await upcomingResponse.json();
      setUpcomingTasks(upcomingData);

      // Fetch overdue tasks
      const overdueResponse = await fetch(`${API}/overdue/list`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const overdueData = await overdueResponse.json();
      setOverdueTasks(overdueData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  return (
    <div className="notifications-panel">
      {overdueTasks.length > 0 && (
        <div className="notification-section overdue">
          <h3>🔴 Overdue Tasks ({overdueTasks.length})</h3>
          <div className="notification-list">
            {overdueTasks.map(task => (
              <div key={task._id} className="notification-item">
                <p className="notification-title">{task.title}</p>
                <p className="notification-date">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {upcomingTasks.length > 0 && (
        <div className="notification-section upcoming">
          <h3>📅 Due Today ({upcomingTasks.length})</h3>
          <div className="notification-list">
            {upcomingTasks.map(task => (
              <div key={task._id} className="notification-item">
                <p className="notification-title">{task.title}</p>
                <p className="notification-priority">
                  Priority: {task.priority}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {upcomingTasks.length === 0 && overdueTasks.length === 0 && (
        <div className="no-notifications">
          <p>✅ You're all caught up!</p>
        </div>
      )}
    </div>
  );
}

export default Notifications;