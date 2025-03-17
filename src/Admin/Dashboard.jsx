import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import { useTranslation } from 'react-i18next';

export default function Dashboard({ users, tasks }) {
  const { t, i18n } = useTranslation();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    highPriorityTasks: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // For debugging
  useEffect(() => {
    console.log('Current language:', i18n.language);
    console.log('Translation test:', t('admin.dashboard'));
  }, [i18n.language, t]);

  useEffect(() => {
    // Calculate stats from props
    if (users && tasks) {
      const activeUsers = users.filter(user => user.status === 'active').length;
      const completedTasks = tasks.filter(task => task.progress === 100).length;
      const pendingTasks = tasks.filter(task => task.progress < 100).length;
      const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;

      setStats({
        totalUsers: users.length,
        activeUsers,
        totalTasks: tasks.length,
        completedTasks,
        pendingTasks,
        highPriorityTasks
      });

      // Fetch recent activities
      fetchRecentActivities();
    }
  }, [users, tasks]);

  const fetchRecentActivities = () => {
    setIsLoading(true);
    axios.get('http://localhost:8000/Admin/activities?limit=5')
      .then(response => {
        if (response.data && Array.isArray(response.data.activities)) {
          setRecentActivities(response.data.activities);
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching activities:', error);
        setIsLoading(false);
      });
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get activity badge class based on activity type
  const getActivityBadgeClass = (type) => {
    switch (type?.toLowerCase()) {
      case 'login':
        return 'badge-success';
      case 'logout':
        return 'badge-warning';
      case 'task_created':
        return 'badge-primary';
      case 'task_updated':
        return 'badge-info';
      case 'task_completed':
        return 'badge-success';
      case 'user_created':
        return 'badge-primary';
      case 'user_updated':
        return 'badge-info';
      default:
        return 'badge-secondary';
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-details">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-user-check"></i>
          </div>
          <div className="stat-details">
            <h3>{stats.activeUsers}</h3>
            <p>Active Users</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-tasks"></i>
          </div>
          <div className="stat-details">
            <h3>{stats.totalTasks}</h3>
            <p>Total Tasks</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-details">
            <h3>{stats.completedTasks}</h3>
            <p>Completed Tasks</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-hourglass-half"></i>
          </div>
          <div className="stat-details">
            <h3>{stats.pendingTasks}</h3>
            <p>Pending Tasks</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="stat-details">
            <h3>{stats.highPriorityTasks}</h3>
            <p>High Priority</p>
          </div>
        </div>
      </div>
      
      <div className="dashboard-sections">
        <div className="section">
          <h2 className="section-title">Recent Activities</h2>
          {isLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : recentActivities.length > 0 ? (
            <div className="activity-list">
              {recentActivities.map((activity, index) => (
                <div className="activity-item" key={index}>
                  <div className="activity-icon">
                    <span className={`activity-badge ${getActivityBadgeClass(activity.type)}`}>
                      {activity.type?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="activity-content">
                    <p className="activity-text">
                      <strong>{activity.user}</strong> {activity.description}
                    </p>
                    <p className="activity-time">{formatDate(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No recent activities found</p>
            </div>
          )}
        </div>
        
        <div className="section">
          <h2 className="section-title">Task Completion</h2>
          <div className="progress-container">
            {tasks && tasks.length > 0 ? (
              <>
                <div className="progress-stats">
                  <div className="progress-stat">
                    <h3>{stats.completedTasks}</h3>
                    <p>Completed</p>
                  </div>
                  <div className="progress-stat">
                    <h3>{stats.pendingTasks}</h3>
                    <p>Pending</p>
                  </div>
                  <div className="progress-stat">
                    <h3>{stats.highPriorityTasks}</h3>
                    <p>High Priority</p>
                  </div>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-label">
                    <span>Task Completion Rate</span>
                    <span>{stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%</span>
                  </div>
                  <div className="progress">
                    <div 
                      className="progress-bar" 
                      style={{ 
                        width: `${stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0}%`,
                        backgroundColor: 'var(--success)'
                      }}
                    ></div>
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <p>No tasks available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 