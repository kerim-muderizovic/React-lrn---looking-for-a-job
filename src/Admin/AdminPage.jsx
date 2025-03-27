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
import { toast, ToastContainer } from 'react-toastify';
import TestModal from './TestModal'; // Import the test modal component
import NotificationManager from './NotificationManager';

export default function AdminPage() {
    // State to store users, tasks, and admin name
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentEditData, setCurrentEditData] = useState(null);
    const [editType, setEditType] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const { t } = useTranslation();
    const { authUser, fetchAuthenticatedUser } = useAuth(); // Access the authenticated user from context
    const [adminName, setAdminName] = useState('');
    const [selectedScreen, setscreen] = useState('Dashboard');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedChatUser, setSelectedChatUser] = useState(null);
    const [modalAddNewTask, setModalAddNewTaskOpen] = useState(false); // Modal visibility state

    // Fetch users function
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/user/getAll');
        setUsers(response.data); // Set users data to state
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Error fetching users');
      }
    };

    // Fetch tasks function
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/getAllTasks');
        if (response.data && Array.isArray(response.data.tasks)) {
          setTasks(response.data.tasks);
          console.log(response.data.tasks,'fetch tasks');
          setLoading(false);
        } else {
          console.error('Expected an array of tasks, but got:', response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setLoading(false);
      }
    };

    // Handle delete user function
    const handleDeleteUser = (userId) => {
      console.log('Deleting user with id:', userId);
      
      if (!userId) {
        console.error('No userId provided for deletion');
        toast.error('Error: No user ID provided');
        return;
      }

      axios.delete(`/Admin/users/${userId}`)
        .then(() => {
          fetchUsers();
          toast.success('User deleted successfully');
          console.log('Successfully deleted user with id:', userId);
        })
        .catch(error => {
          console.error('Error deleting user:', error);
          toast.error('Error deleting user');
        });
    };

    // Handle delete task function
    const handleDeleteTask = (taskId) => {
      if (!taskId) {
        console.error('No taskId provided for deletion');
        toast.error('Error: No task ID provided');
        return;
      }

      axios.delete(`/Admin/tasks/${taskId}`)
        .then(() => {
          fetchTasks();
          toast.success('Task deleted successfully');
          console.log('Successfully deleted task with id:', taskId);
        })
        .catch(error => {
          console.error('Error deleting task:', error);
          toast.error('Error deleting task');
        });
    };

    // User approval function
    const handleApproveUser = (userId) => {
      if (!userId) {
        console.error('No userId provided for approval');
        toast.error('Error: No user ID provided');
        return;
      }

      axios.put(`/Admin/users/${userId}/approve`, {}, { withXSRFToken: true })
        .then(() => {
          fetchUsers();
          toast.success('User approved successfully');
          console.log('Successfully approved user with id:', userId);
        })
        .catch(error => {
          console.error('Error approving user:', error);
          toast.error('Error approving user');
        });
    };
    
    // Render selected screen
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
              handleApproveUser={handleApproveUser}
            /> ) : <Loading/>;
        case 'Settings':
          return <Settings />;
        case 'TestModal':
          return <TestModal />;
        case 'Notifications':
          return <NotificationManager />;
        default:
          return null;
      }
    };

    // Open edit modal function
    const openEditModal = (type, data) => {
      setEditType(type);
      setCurrentEditData(data);
      setIsEditModalOpen(true);
      console.log('Edit modal opened:', { type, data });
    };
    
    // Start chat function
    const startChat = (userId) => {
      if (!userId) {
        console.error('No userId provided for chat');
        toast.error('Error: No user ID provided');
        return;
      }
      console.log('Starting chat with user ID:', userId);
      setSelectedChatUser(userId); // Set the selected user for chat
      setscreen('Chat'); // Switch to chat screen
    };
    
    // Close chat function
    const closeChat = () => {
      setSelectedChatUser(null); // Reset the selected chat user
    };
    
    // Close edit modal function
    const closeEditModal = () => {
      setIsEditModalOpen(false);
      setCurrentEditData(null);
      setEditType(null);
      console.log('Edit modal closed');
    };

    // Save changes function
    const saveChanges = async (updatedData) => {
      if (!updatedData.id) {
        console.error('No ID provided for update');
        return;
      }

      try {
        const endpoint = editType === 'user' ? `/api/users/${updatedData.id}` : `/api/tasks/${updatedData.id}`;
        const method = 'PUT';

        // For user edits, ensure role is explicitly set and passed as a string
        if (editType === 'user') {
          updatedData.role = updatedData.role || 'user';
          console.log('Saving user with role:', updatedData.role);
        }

        const response = await axios({
          method,
          url: endpoint,
          data: updatedData,
        });

        if (response.status === 200) {
          // If this is a task creation and the user is an admin
          if (editType === 'task' && authUser?.user?.role === 'admin') {
            // Send notification to the assigned user
            if (updatedData.assigned_to) {
              try {
                await axios.post('/api/notifications', {
                  user_id: updatedData.assigned_to,
                  type: 'task',
                  title: 'New Task Assigned',
                  message: `You have been assigned a new task: ${updatedData.title}`,
                  data: {
                    task_name: updatedData.title,
                    task_description: updatedData.description,
                    task_id: updatedData.id,
                    priority: updatedData.priority,
                    due_date: updatedData.due_date
                  }
                });
              } catch (error) {
                console.error('Error sending notification:', error);
                toast.error('Task created but notification failed to send');
              }
            }
          }

          // Update local state
          if (editType === 'user') {
            setUsers(prevUsers =>
              prevUsers.map(user =>
                user.id === updatedData.id ? response.data : user
              )
            );
          } else {
            setTasks(prevTasks =>
              prevTasks.map(task =>
                task.id === updatedData.id ? response.data : task
              )
            );
          }

          // If the updated user is the currently logged-in user, refresh the auth context
          if (editType === 'user' && updatedData.id === authUser.user.id) {
            await fetchAuthenticatedUser();
          }

          setIsEditModalOpen(false);
          toast.success(t('admin.changesSaved'));
        }
      } catch (error) {
        console.error('Error saving changes:', error);
        toast.error(error.response?.data?.message || t('admin.errorSaving'));
      }
    };

    // Toggle modal function
    const toggleModal = () => setModalOpen(!modalOpen);

    // Show description function
    const showDescription = (task) => {
      setSelectedTask(task);
      console.log('Showing description for task:', task);
      toggleModal();
    };

    // Toggle add new task modal function
    const toggleModalAddNewTask = () => setModalAddNewTaskOpen(!modalAddNewTask);

    // Fetch users, tasks, and admin name on component mount
    useEffect(() => {
      setLoading(true);
      fetchTasks();
      
      if (authUser && authUser.user) {
        console.log('Current user:', authUser);
        setAdminName(authUser.user.name);
      }
      
      fetchUsers();
    }, []); // Empty dependency array to run once on mount

    return (
      <div className="admin-container">
        {/* Sidebar */}
        <SideBar 
          users={users} 
          setscreen={setscreen} 
          selectedScreen={selectedScreen}
        />
        
        {/* Main content area */}
        <div className="admin-content">
          {renderSelectedScreen()}
          
          {/* Debug button for test modal */}
          {selectedScreen !== 'TestModal' && (
            <button 
              onClick={() => setscreen('TestModal')}
              style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: 1000,
                backgroundColor: '#4b6cb7',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                cursor: 'pointer'
              }}
              title="Test Modal"
            >
              <i className="fas fa-bug"></i>
            </button>
          )}
        </div>

        {/* Modals */}
        <EditModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          type={editType}
          data={currentEditData}
          onChange={setCurrentEditData}
          onSave={saveChanges}
        />
        
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </div>
    );
}
