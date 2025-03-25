import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig'; // Import configured axios
import SideBar from './sideBar';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBIcon,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn,
  MDBModal,
  MDBModalHeader,
  MDBModalFooter,
  MDBModalBody
} from 'mdb-react-ui-kit';
import ChatWindow from '../chatWindows';
import EditModal from './editModal';
import './AdminPage.css'; // Optional CSS file for custom styles
import './addNewTaskAdmin.css'; // Import the task modal styling
import AddNewTaskAdmin from './addNewTask';
import { useAuth } from '../AuthContext';
import ActivityLog from './activityLog';
import UserTask from './UsersTask';
import Settings from './settings';
import Loading from './isLoading';
import Dashboard from './Dashboard';
import ChatAdmin from './ChatAdmin'; // Import the ChatAdmin component
import { useTranslation } from 'react-i18next';
// import api from '../utils/api';

const handleDeleteUser =()=>{
    console.log('clicked')
}


export default function AdminPage() {
    // State to store users, tasks, and admin name
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentEditData, setCurrentEditData] = useState(null);
    const [editType, setEditType] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const { t } = useTranslation();

    const [selectedScreen, setscreen] = useState('Dashboard');
    const renderSelectedScreen = () => {
      switch (selectedScreen) {
        case 'Dashboard':
          return !isLoading ? <Dashboard users={users} tasks={tasks} /> : <Loading />;
        case 'activityLog':
          return <ActivityLog users={users} />;
        case 'Chat':
          return <ChatAdmin />;
        case 'UserTask':
          return !isLoading ? (
            <UserTask
              users={users}
              tasks={tasks}
              startChat={startChat}
              openEditModal={openEditModal}
              handleDeleteUser={handleDeleteUser}
              handleDeleteTask={handleDeleteTask}
            /> ) : <Loading/>;
        case 'Settings':
          return <Settings />;
        default:
          return null;
      }
    }
    const openEditModal = (type, data) => {
        setEditType(type);
        setCurrentEditData(data);
        setIsEditModalOpen(true);
        console.log('reachead');
        console.log("EditModal Open Function Called:", { 
          type, 
          data, 
          isEditModalOpen 
      });
    };
    const [selectedChatUser, setSelectedChatUser] = useState(null);
    const startChat = (userId) => {
        setSelectedChatUser(userId); // Set the selected user for chat
      };
      
      const closeChat = () => {
        setSelectedChatUser(null); // Reset the selected chat user
      };
  const [modalAddNewTask, setModalAddNewTaskOpen] = useState(false); // Modal visibility state
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentEditData(null);
    setEditType(null);
  };
const fetchTasks = async () => {
  try {
    const response = await axios.get('/getAllTasks');
    if (response.data && Array.isArray(response.data.tasks)) {
      setTasks(response.data.tasks);
      console.log(response.data.tasks,'fetch tasks');
      setLoading(false);
    }
     else {
      console.error('Expected an array of tasks, but got:', response.data);
      setLoading(false);
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
    setLoading(false);
  }
}
  const saveChanges = () => {
    const url =
      editType === "user"
        ? `/Admin/users/${currentEditData.id}`
        : `/Admin/tasks/${currentEditData.id}`;
  
    axios.put(url, currentEditData)
      .then((response) => {
        alert(`${editType === "user" ? "User" : "Task"} updated successfully!`);
        closeEditModal();
        // Optionally refetch data
        fetchTasks();
        
      })
      .catch((error) => console.error(`Error updating ${editType}:`, error));
  };
  

      const { authUser } = useAuth(); // Access the authenticated user from context
    
    const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const toggleModal = () => setModalOpen(!modalOpen);

  const showDescription = (task) => {
    setSelectedTask(task);
    console.log(task);
    console.log(modalOpen);
    toggleModal();
  };
  const [adminName, setAdminName] = useState('');
  const handleDeleteTask = (taskId) => {
    axios.delete(`/Admin/tasks/${taskId}`)
      .then(() => {
        fetchTasks();
        console.log('uspjesno izbrisan task!!!!');
      })
      .catch(error => {
        console.error('Error deleting task:', error);
      });
  }
  // Fetch users, tasks, and admin name on component mount
  useEffect(() => {
    
fetchTasks();
        console.log('ucitANI U OVOM SRANJU:',authUser);
        setAdminName(authUser.user.name)
    // Replace 'users_url' and 'tasks_url' with actual API endpoints
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/user/getAll');
        setUsers(response.data); // Set users data to state
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []); // Empty dependency array to run once on mount
const toggleModalAddNewTask =()=>setModalAddNewTaskOpen(!modalAddNewTask);


  return (
    <div className="admin-container">
      {/* Sidebar */}
      <SideBar users={users} setscreen={setscreen} selectedScreen={selectedScreen}></SideBar>
      
      {/* Main content area */}
      <div className="admin-content">
        {renderSelectedScreen()}
      </div>

      {/* Modals */}
      <EditModal
        isOpen={isEditModalOpen}
        type={editType}
        data={currentEditData}
        onChange={setCurrentEditData}
        onSave={saveChanges}
        onClose={closeEditModal}
      />
    </div>
  );
}
