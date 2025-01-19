import React, { useState, useEffect } from "react";
import axios from "axios";
import { Route, Routes, useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBNavbar,
  MDBNavbarBrand,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBProgress,
  MDBProgressBar,
} from "mdb-react-ui-kit";
import Login from "./login";
import "./crmMainPart.css";
import { useAuth } from "./AuthContext";
import { useTranslation } from "react-i18next";
export default function CRMApp() {
  const {t}=useTranslation();
  const { authUser,fetchAuthenticatedUser } = useAuth(); // Access the authenticated user from context
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Low",
    progress: 0,
    users: [],
  });
  const [tasks, setTasks] = useState([]);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [updatedTasks, setUpdatedTasks] = useState(tasks);
  const phases = [0, 25, 50, 75, 100];
  useEffect(() => {
    console.log('user pri ucitavanju ', authUser);

    const fetchTasks = async () => {
      try {
     
        const tasksResponse = await axios.get("http://localhost:8000/getUserTasks", {
          withCredentials: true,
        });
        console.log('Tasks response prilikom uzimanja za konkretnog', tasksResponse.data);
    
        // Set tasks in state
        setTasks(tasksResponse.data.tasks || []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/assignable-users", {
          withCredentials: true,
        });
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
     axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });

    fetchTasks();
    fetchUsers();
  }, []);

  
  const updateTaskProgress = async (taskId, newProgress) => {
    try {
      // Ensure CSRF cookie is set first
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });
  
      // Now send the PUT request with the CSRF token
      const response = await axios.put(
        `http://localhost:8000/tasks/${taskId}`,
        { progress: newProgress },
        { 
          withCredentials: true, // Include credentials (cookies) in the request
        withXSRFToken:true
        }
      );
  
      // If the update was successful, update the local state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, progress: newProgress } : task
        )
      );
  
      console.log('Task updated:', response.data); // Log the response
    } catch (error) {
      console.error("Error updating task progress:", error);
    }
  };
  
  
    // Define drag-and-drop phases
  const handleDeleteTask = async (taskId) => {
    try {
      // Send delete request to the backend
      await axios.get('http://localhost:8000/sanctum/csrf-cookie');

      const response = await axios.delete(`http://localhost:8000/DeleteTask/${taskId}`, {
        withXSRFToken: true,
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true, 
        
      });
      // If successful, remove the task from the UI state
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      console.log(response.data.message); // Success message from backend
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("There was an error deleting the task. Please try again.");
    }
  };
  const navigate = useNavigate();


  const handleAddTask = async () => {
    try {
      
      console.log("taskova vr:",newTask)
      const { data } = await axios.post(
        "http://localhost:8000/postTask",
        newTask,
        { 
          withXSRFToken:true,
          withCredentials: true }
      );
      setTasks((prevTasks) => [...prevTasks, data.task]);
      setModalOpen(false);
      setNewTask({
        title: "",
        description: "",
        priority: "Low",
        progress: 0,
        users: [authUser.user.id], // Ensure the user ID is set 
         });
      console.log('when adding task authUser is ', authUser);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const toggleModal = () => setModalOpen((prev) => !prev);


  if (!authUser.isLoggedIn) {
    return <div> loading</div>
  }

  const priorityColors = {
    high: "rgba(255, 0, 0, 0.2)",
    medium: "rgba(255, 165, 0, 0.2)",
    low: "rgba(0, 128, 0, 0.2)",
  };

  return (
    <MDBContainer fluid className="vh-100">
    {!authUser.isLoggedIn && (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          flexDirection: 'column',
        }}
      >
        <h2>{t('authRequired')}</h2>
        <MDBBtn color="primary" onClick={() => navigate('/login')}>
          {t('navbar.signIn')}
        </MDBBtn>
      </div>
    )}
  
    <MDBRow className="h-100">
      <MDBCol size="3" className="bg-light p-3">
        <MDBNavbar light bgColor="light" className="flex-column h-100">
          {authUser.isLoggedIn && (
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <img
                className="profileImage"
                src={authUser.user.profilePicture || '/default-avatar.png'}
                alt={`${authUser.name}'s profile`}
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  marginBottom: '10px',
                }}
                onClick={() => navigate('/user-profile')}
              />
              <h5>{authUser.user.name}</h5>
            </div>
          )}
          <div className="addTaskBTN">
            <MDBBtn color="primary" className="mt-3 w-100" onClick={toggleModal}>
              {t('crm.tasks.addTask')}
            </MDBBtn>
          </div>
        </MDBNavbar>
      </MDBCol>
      <MDBCol size="9" className="p-4">
        <h2>{t('crm.tasks.title')}</h2>
        {tasks.map((task) => (
          <MDBCard
            key={task.id}
            style={{
              backgroundColor: priorityColors[task.priority],
              marginBottom: '15px',
              position: 'relative',
            }}
          >
            <MDBCardBody className="Task">
              <MDBCardTitle>{task.title}</MDBCardTitle>
              <MDBCardText>{task.description}</MDBCardText>
              <MDBCardText>
                {t('crm.tasks.progress')}: {task.progress}%
              </MDBCardText>
  
              <div
                style={{
                  position: 'relative',
                  height: '20px',
                  backgroundColor: '#d3d3d3',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
                onMouseDown={(e) => {
                  const boundingRect = e.target.getBoundingClientRect();
                  const offsetX = e.clientX - boundingRect.left;
                  const newProgress = Math.min(100, Math.max(0, Math.round((offsetX / boundingRect.width) * 100)));
                  updateTaskProgress(task.id, newProgress);
                }}
                onMouseMove={(e) => {
                  if (e.buttons !== 1) return; // Check if mouse is held down
                  const boundingRect = e.target.getBoundingClientRect();
                  const offsetX = e.clientX - boundingRect.left;
                  const newProgress = Math.min(100, Math.max(0, Math.round((offsetX / boundingRect.width) * 100)));
                  updateTaskProgress(task.id, newProgress);
                }}
              >
                <div
                  style={{
                    width: `${task.progress}%`,
                    height: '100%',
                    backgroundColor: '#4caf50',
                    borderRadius: '5px',
                    transition: 'width 0.2s ease-in-out',
                  }}
                />
              </div>
  
              <MDBBtn
                color="danger"
                onClick={() => handleDeleteTask(task.id)}
                style={{ position: 'absolute', top: '10px', right: '10px' }}
              >
                {t('crm.tasks.delete')}
              </MDBBtn>
            </MDBCardBody>
          </MDBCard>
        ))}
      </MDBCol>
    </MDBRow>
  
    {modalOpen && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>{t('crm.tasks.addTask')}</h3>
          <input
            type="text"
            placeholder={t('crm.tasks.taskName')}
            value={newTask.title}
            onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
          />
          <textarea
            placeholder={t('crm.tasks.taskDescription')}
            value={newTask.description}
            onChange={(e) => setNewTask((prev) => ({ ...prev, description: e.target.value }))}
          ></textarea>
          <select
            value={newTask.priority}
            onChange={(e) => setNewTask((prev) => ({ ...prev, priority: e.target.value }))}
          >
            <option value="low">{t('crm.tasks.low')}</option>
            <option value="medium">{t('crm.tasks.medium')}</option>
            <option value="high">{t('crm.tasks.high')}</option>
          </select>
          <button onClick={handleAddTask}>{t('crm.tasks.addTask')}</button>
          <button onClick={toggleModal}>{t('modal.buttons.close')}</button>
        </div>
      </div>
    )}
  
    <Routes>
      <Route path="/login" element={<Login />} />
    </Routes>
  </MDBContainer>
  
)
}
