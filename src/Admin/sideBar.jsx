import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // For navigation
import './sideBar.css'; // Import your CSS file
import AddNewTaskAdmin from './addNewTask';
const Sidebar = ( {users,setscreen,selectedScreen} ) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <h3>{isCollapsed ? '' : 'Admin Panel'}</h3>
       
      </div>

      {/* Sidebar Menu */}
      <ul className="sidebar-menu">
        <li>
          <Link >
            <span className="icon">🏠</span>
            {!isCollapsed && <span className="text">Dashboard</span>}
          </Link>
        </li>
        <li>
          <Link>
            <span className="icon">👥</span>
            {!isCollapsed && <span className="text" onClick={()=>setscreen('UserTask')}>Users</span>}
          </Link>
        </li>
        <li>
          <Link>
          <span className='icon'>
          <i class="fa-solid fa-clock-rotate-left"></i>
          </span>
            {!isCollapsed && <span className="text" onClick={()=>setscreen('activityLog')} >Activity log</span>}
          </Link>
        </li>
        <li>
          <Link >
            <span className="icon">⚙️</span>
            {!isCollapsed && <span className="text" onClick={()=>setscreen('Settings')}>Settings</span>}
          </Link>
        </li>
        <div>
    </div>
       {selectedScreen==='UserTask' && <AddNewTaskAdmin users={users}/>}
      </ul>
    </div>
  );
};

export default Sidebar;
