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
        <li className={isActive('Dashboard')}>
          <Link onClick={() => setscreen('Dashboard')}>
            <span className="icon">
              <i className="fas fa-tachometer-alt"></i>
            </span>
            {!isCollapsed && <span className="text">Dashboard</span>}
          </Link>
        </li>
        <li className={isActive('UserTask')}>
          <Link onClick={() => setscreen('UserTask')}>
            <span className="icon">
              <i className="fas fa-tasks"></i>
            </span>
            {!isCollapsed && <span className="text">Tasks & Users</span>}
          </Link>
        </li>
        <li className={isActive('Chat')}>
          <Link onClick={() => setscreen('Chat')}>
            <span className="icon">
              <i className="fas fa-comments"></i>
            </span>
            {!isCollapsed && <span className="text">Chat</span>}
          </Link>
        </li>
        <li className={isActive('activityLog')}>
          <Link onClick={() => setscreen('activityLog')}>
            <span className="icon">
              <i className="fas fa-history"></i>
            </span>
            {!isCollapsed && <span className="text">Activity Log</span>}
          </Link>
        </li>
        <li className={isActive('Settings')}>
          <Link onClick={() => setscreen('Settings')}>
            <span className="icon">
              <i className="fas fa-cog"></i>
            </span>
            {!isCollapsed && <span className="text">Settings</span>}
          </Link>
        </li>
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
