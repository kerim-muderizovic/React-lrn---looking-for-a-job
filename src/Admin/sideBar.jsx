import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // For navigation
import './sideBar.css'; // Import your CSS file
import AddNewTaskAdmin from './addNewTask';
import { useTranslation } from 'react-i18next';

const Sidebar = ({ users, setscreen, selectedScreen }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { t, i18n } = useTranslation();

  // For debugging
  useEffect(() => {
    console.log('Current language in Sidebar:', i18n.language);
    console.log('Translation test in Sidebar:', t('admin.panel'));
  }, [i18n.language, t]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Helper function to determine if a menu item is active
  const isActive = (screenName) => {
    return selectedScreen === screenName ? 'active' : '';
  };

  const menuItems = [
    { id: 'Dashboard', icon: 'chart-line', label: 'Dashboard' },
    { id: 'UserTask', icon: 'users', label: 'Users & Tasks' },
    { id: 'activityLog', icon: 'history', label: 'Activity Log' },
    { id: 'Chat', icon: 'comments', label: 'Chat' },
    { id: 'Notifications', icon: 'bell', label: 'Notifications' },
    { id: 'Settings', icon: 'cog', label: 'Settings' },
  ];

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <h3>{isCollapsed ? '' : 'Admin Panel'}</h3>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Sidebar Menu */}
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li key={item.id} className={isActive(item.id)}>
            <Link onClick={() => setscreen(item.id)}>
              <span className="icon">
                <i className={`fas fa-${item.icon}`}></i>
              </span>
              {!isCollapsed && <span className="text">{item.label}</span>}
            </Link>
          </li>
        ))}
        <li>
          <Link to="/logout">
            <span className="icon">
              <i className="fas fa-sign-out-alt"></i>
            </span>
            {!isCollapsed && <span className="text">Logout</span>}
          </Link>
        </li>
      </ul>

      {/* Add Task Button - Only show when on UserTask screen */}
      {selectedScreen === 'UserTask' && (
        <div className="add-task-container">
          <AddNewTaskAdmin users={users} />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
