import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // For navigation
import './sideBar.css'; // Import your CSS file
import AddNewTaskAdmin from './addNewTask';
const Sidebar = ( {users} ) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <h3>Admin Panel</h3>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isCollapsed ? '>' : '<'}
        </button>
      </div>

      {/* Sidebar Menu */}
      <ul className="sidebar-menu">
        <li>
          <Link to="/dashboard">
            <span className="icon">🏠</span>
            {!isCollapsed && <span className="text">Dashboard</span>}
          </Link>
        </li>
        <li>
          <Link to="/users">
            <span className="icon">👥</span>
            {!isCollapsed && <span className="text">Users</span>}
          </Link>
        </li>
        <li>
          <Link to="/products">
            <span className="icon">📦</span>
            {!isCollapsed && <span className="text">Products</span>}
          </Link>
        </li>
        <li>
          <Link to="/settings">
            <span className="icon">⚙️</span>
            {!isCollapsed && <span className="text">Settings</span>}
          </Link>
      <AddNewTaskAdmin users={users}/>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
