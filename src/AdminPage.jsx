import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios for HTTP requests
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
import ChatWindow from './chatWindows';
import EditModal from './editModal';
import './AdminPage.css'; // Optional CSS file for custom styles
import AddNewTaskAdmin from './addNewTask';
import { useAuth } from './AuthContext';
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
    const openEditModal = (type, data) => {
        setEditType(type);
        setCurrentEditData(data);
        setIsEditModalOpen(true);
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
const fetchTasks=()=>
{
    axios.get('http://localhost:8000/getAllTasks') // URL for tasks data
      .then(response => {
        if (response.data && Array.isArray(response.data.tasks)) {
          setTasks(response.data.tasks);
        } else {
          console.error('Expected an array of tasks, but got:', response.data);
        }
      })
      .catch(error => console.error('Error fetching tasks:', error));
}
  const saveChanges = () => {
    const url =
      editType === "user"
        ? `http://localhost:8000/Admin/users/${currentEditData.id}`
        : `http://localhost:8000/Admin/tasks/${currentEditData.id}`;
  
    axios
      .put(
        url,
        currentEditData, // Request payload
        {
          withCredentials: true,
          withXSRFToken:true,
        }
      )
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
  const handleDeleteTask =(taskId) =>{
    axios.delete(`http://localhost:8000/Admin/tasks/${taskId}`, {
        withCredentials: true,
        withXSRFToken: true,
      }).then((res)=>{
          fetchTasks();
          console.log('uspjesno izbrisan task!!!!').catch(err=>console.error('velika kita'));
     })
}
  // Fetch users, tasks, and admin name on component mount
  useEffect(() => {
    
fetchTasks();
        console.log('ucitANI U OVOM SRANJU:',authUser);
        setAdminName(authUser.user.name)
    // Replace 'users_url' and 'tasks_url' with actual API endpoints
    axios.get('http://localhost:8000/user/getAll') // URL for users data
      .then(response => {
        setUsers(response.data); // Set users data to state
      })
      .catch(error => console.error('Error fetching users:', error));

    
     

  }, []); // Empty dependency array to run once on mount
const toggleModalAddNewTask =()=>setModalAddNewTaskOpen(!modalAddNewTask);


  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="sidebar bg-light p-3">
        <MDBNavbarBrand href="/admin" className="mb-4">
          <MDBIcon fas icon="tools" className="me-2" /> Admin Panel
        </MDBNavbarBrand>
        <MDBNavbarNav>
          <MDBNavbarItem>
            <MDBNavbarLink href="/admin/users">
              <MDBIcon fas icon="user" className="me-2" /> Users
            </MDBNavbarLink>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <MDBNavbarLink href="/admin/tasks">
              <MDBIcon fas icon="tasks" className="me-2" /> Tasks
            </MDBNavbarLink>
          </MDBNavbarItem>
        </MDBNavbarNav>
        <div className="mt-4">
          <strong>Admin:</strong> {adminName || 'Loading...'}
        </div>
        
<AddNewTaskAdmin users={users} /> {/* This component handles the task creation modal */}

      </div>

      {/* Main Content */}
      <MDBContainer className="main-content">
        <h1 className="my-4">User Management</h1>
        <MDBRow>
          <MDBCol>
            <MDBTable responsive striped hover>
              <MDBTableHead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {users.filter((u) => u.role !== 'admin').map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                    <td>
  <MDBBtn
    size="sm"
    color="info"
    onClick={() => startChat(user.id)}
  >
    Chat
  </MDBBtn>
</td>
                      <MDBBtn size="sm" color="primary" className="me-2" onClick={() => openEditModal("user", user)}>
                        Edit
                      </MDBBtn>
                      <MDBBtn size="sm" color="danger" onClick={handleDeleteUser()}>
                        Delete
                      </MDBBtn>
                      {!user.approvedByAdmin && (
                        <MDBBtn size="sm" color="warning">
                          Approve
                        </MDBBtn>
                      )}
                    </td>
                  </tr>
                ))}
              </MDBTableBody>
            </MDBTable>
          </MDBCol>
        </MDBRow>

        <h2 className="my-4">Task Management</h2>
      <div className="row">
        <div className="col">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Task Name</th>
                <th>Description</th>
                <th>Assigned User</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={task.id}>
                  <td>{index + 1}</td>
                  <td>{task.title}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => showDescription(task)}
                    >
                      Show Description
                    </button>
                  </td>
                  <td>
                    {task.assigned_users && task.assigned_users.length > 0
                      ? task.assigned_users.map((user) => user.name).join(', ')
                      : 'No users assigned'}
                  </td>
                  <td>{task.progress} %</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-2"  onClick={() => openEditModal("task", task)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={()=>handleDeleteTask(task.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <EditModal
        isOpen={isEditModalOpen}
        type={editType}
        data={currentEditData}
        onChange={setCurrentEditData}
        onSave={saveChanges}
        onClose={closeEditModal}
      />
    

      {/* Modal for Description */}
      {selectedTask && (
        <div
          className={`modal fade ${modalOpen ? 'show d-block' : ''}`}
          tabIndex="-1"
          style={{ backgroundColor: modalOpen ? 'rgba(0, 0, 0, 0.5)' : 'none' }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Task Description - {selectedTask.title}
                </h5>
              </div>
              <div className="modal-body">
                {selectedTask.description
                  ? selectedTask.description
                  : 'No description available.'}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={toggleModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
{selectedChatUser && (
  <ChatWindow
  userId={authUser.id}
  receiverId={selectedChatUser}
  onClose={closeChat}
/>
)}
      <MDBRow>
      </MDBRow>
      </MDBContainer>
    </div>
  );
}
