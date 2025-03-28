import React, { useState, useEffect,useMemo, createPortal } from "react";
import axios from "./axiosConfig";
import { Await, Route, Routes, useNavigate } from "react-router-dom";
import { Pie } from 'react-chartjs-2';
import Calendar from "./calendar";
import UserChatBubble from "./UserChatBubble";
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
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { format } from 'date-fns';
import DatePicker from "react-datepicker";
import Login from "./login";
import "./crmMainPart.css";
import 'react-datepicker/dist/react-datepicker.css'; // Import the default CSS
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
    due_date: null, // Use null for react-datepicker
  });
  const [taskProgressData, setTaskProgressData] = useState([0, 0, 0]); // Default to 0 values
  const [isLoading, setIsLoading] = useState(false); // Add isLoading state
  ChartJS.register(ArcElement, Tooltip, Legend);
  
  const [tasks, setTasks] = useState([]);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [updatedTasks, setUpdatedTasks] = useState(tasks);
  const phases = [0, 25, 50, 75, 100];
  const dataa = useMemo(() => ({
    labels: ['In Progress', 'Completed', 'Not Started'],
    datasets: [
      {
        data: taskProgressData,
        backgroundColor: ['#ffeb3b', '#4caf50', '#f44336'], // Bright yellow, green, red
        hoverBackgroundColor: ['#f57f17', '#2e7d32', '#c62828'], // Darker versions
        borderColor: ['#ffffff', '#ffffff', '#ffffff'],
        borderWidth: 2,
      },
    ],
    options: {
      responsive: true,
      maintainAspectRatio: true,
    }
  }), [taskProgressData]);

  // Define fetchTasksAndProgresses outside of useEffect so it can be reused
  const fetchTasksAndProgresses = async () => {
    try {
      setIsLoading(true);
      
      // Fetch task progresses
      const tasksProgressesResponse = await axios.get("/task-progresses");
      console.log('Task progresses:', tasksProgressesResponse.data);
      
      if (tasksProgressesResponse.data) {
        setTaskProgressData([
          tasksProgressesResponse.data.in_progress_tasks,  // In Progress
          tasksProgressesResponse.data.completed_tasks,   // Completed
          tasksProgressesResponse.data.not_started_tasks,  // Not Started
        ]);
      }

      // Fetch tasks
      const tasksResponse = await axios.get("/getUserTasks");
      console.log('Tasks response:', tasksResponse.data);
      
      if (tasksResponse.data && tasksResponse.data.tasks) {
        // Filter tasks with progress < 100
        const filterTasks = (tasksResponse.data.tasks || []).filter(task => task.progress < 100);
        setTasks(filterTasks);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('user pri ucitavanju ', authUser);

    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("/assignable-users");
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (authUser && authUser.isLoggedIn) {
      fetchTasksAndProgresses();
      fetchUsers();
    }
  }, [authUser]);
 
  // When dataa changes, update the component to show the new chart data
  useEffect(() => {
    console.log('Task progress data updated:', taskProgressData);
  }, [taskProgressData]);

  const updateTaskProgress = async (taskId, newProgress) => {
    try {
        if (newProgress === 100) {
            const confirmCompletion = window.confirm("Are you sure you want to mark this task as completed?");
            if (!confirmCompletion) {
                return; // Stop if user cancels
            }
        }

        // Ensure CSRF cookie is set first
        await axios.get('/sanctum/csrf-cookie');

        // Now send the PUT request with the CSRF token
        const response = await axios.put(
            `/tasks/${taskId}`,
            { progress: newProgress },
            { 
                withXSRFToken: true,
                withCredentials: true
            }
        );

        // If the update was successful, update the local state
        setTasks((prevTasks) =>
            newProgress === 100
                ? prevTasks.filter((task) => task.id !== taskId) // Remove completed task
                : prevTasks.map((task) =>
                    task.id === taskId ? { ...task, progress: newProgress } : task
                )
        );

        // Fetch updated pie chart data
        fetchTasksAndProgresses();

        console.log('Task updated:', response.data);
    } catch (error) {
        console.error("Error updating task progress:", error);
    }
};

  
  
    // Define drag-and-drop phases
  const handleDeleteTask = async (taskId) => {
    try {
      // Send delete request to the backend
      await axios.get('/sanctum/csrf-cookie');

      // First update the local state to provide immediate visual feedback
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      
      // Then send the delete request to the server
      const response = await axios.delete(`/DeleteTask/${taskId}`, {
        withXSRFToken: true,
        headers: { 'Content-Type': 'application/json' },
      });
      
      // Explicitly fetch updated task progress data to update the pie chart
      fetchTasksAndProgresses();
      
      console.log(response.data.message); // Success message from backend
    } catch (error) {
      console.error("Error deleting task:", error);
      
      // Restore the task in the UI since the deletion failed
      fetchTasksAndProgresses();
      
      // Show specific error messages
      if (error.response) {
        alert(`Error: ${error.response.data.message || 'Failed to delete task'}`);
      } else if (error.request) {
        alert("Network error. Please check your connection and try again.");
      } else {
        alert("There was an error deleting the task. Please try again.");
      }
    }
  };
  const navigate = useNavigate();

  const handleAddTask = async () => {
    try {
        const newData = {
            ...newTask,
            users: [authUser.user.id],
        };

        console.log("taskova vr:", newTask);
        const { data } = await axios.post(
            "/postTask",
            newData,
            { 
                withXSRFToken: true,
                withCredentials: true 
            }
        );

        setTasks((prevTasks) => [...prevTasks, data.task]);

        console.log("Refetching task progress data...");
        
        // Ensure fetchTasksAndProgresses updates state before continuing
         await fetchTasksAndProgresses();  

        console.log("Task progress data refetched successfully.");

        setModalOpen(false);
        setNewTask({
            title: "",
            description: "",
            priority: "Low",
            progress: 0,
            users: [authUser.user.id], 
        });

        console.log('when adding task authUser is ', authUser);
    } 
    catch (error) {
        console.error("Error adding task:", error);
    }
};


  const toggleModal = () => setModalOpen((prev) => !prev);
  const [sortOrder, setSortOrder] = useState("newest");

  // Function to toggle sorting order
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"));
  };

  // Sort tasks based on selected order
  const sortedTasks = [...tasks].sort((a, b) => {
    const dateA = new Date(a.due_date);
    const dateB = new Date(b.due_date);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  // Group tasks by month and year
  const groupedTasks = sortedTasks.reduce((acc, task) => {
    const taskDate = new Date(task.due_date);
    const monthYear = taskDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

    if (!acc[monthYear]) acc[monthYear] = [];
    acc[monthYear].push(task);
    return acc;
  }, {});

  if (!authUser.isLoggedIn) {
    <div class="three-body">
    <div class="three-body__dot"></div>
    <div class="three-body__dot"></div>
    <div class="three-body__dot"></div>
    </div>
  }

  const priorityColors = {
    High: "var(--error-light)",
    high: "var(--error-light)",
    medium: "var(--warning-light)",
    Medium: "var(--warning-light)",
    low: "var(--success-light)",
    Low: "var(--success-light)",
  };
  

  return (
    <MDBContainer fluid className="gDiv">
    {!authUser.isLoggedIn && (
      <div
        style={{
          position: 'absolute',
          top: '54.3px',
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
        <div className="sidebar-wrapper">
          {authUser.isLoggedIn && (
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <img
                className="profileImage"
                src={authUser.user.profilePicture || '/default-avatar.png'}
                alt={`${authUser.name}'s profile`}
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  marginBottom: '5px',
                }}
                onClick={() => navigate('/user-profile')}
              />
              <h5 style={{ marginBottom: '10px' }}>{authUser.user.name}</h5>
            </div>
          )}

          <div className="chart-container">
            <h6 className="chart-title">{t('crm.tasks.progressChart', 'Task Progress')}</h6>
            {taskProgressData.every(value => value === 0) ? (
              <div className="no-data-message" style={{ height: '150px' }}>
                <p>{t('crm.tasks.noTaskData', 'No task data available')}</p>
              </div>
            ) : (
              <Pie 
                data={dataa} 
                options={{
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        boxWidth: 12,
                        padding: 10,
                        font: {
                          size: 12,
                          weight: 'bold'
                        },
                        color: '#333333'
                      }
                    },
                    tooltip: {
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      padding: 10,
                      titleFont: {
                        size: 13,
                        weight: 'bold'
                      },
                      bodyFont: {
                        size: 12
                      },
                      displayColors: true,
                      boxWidth: 8,
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.raw || 0;
                          const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                          const percentage = Math.round((value / total) * 100);
                          return `${label}: ${value} (${percentage}%)`;
                        }
                      }
                    }
                  },
                  cutout: '40%',
                  animation: {
                    animateScale: true,
                    animateRotate: true
                  }
                }}
              />
            )}
          </div>
 
          <div className="calendar-wrapper">
            <Calendar tasks={tasks} />
          </div>

          <div className="addTaskBTN" style={{ marginTop: '10px' }}>
            <MDBBtn color="primary" className="w-100" onClick={toggleModal}>
              {t('crm.tasks.addTask')}
            </MDBBtn>
          </div>
        </div>
      </MDBCol>
      <MDBCol size="9" className="p-4">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <h2>{t("crm.tasks.title")}</h2>
        <button 
          className="sort-button" 
          onClick={toggleSortOrder}
        >
          {sortOrder === "newest" ? t("crm.tasks.sortOldest") : t("crm.tasks.sortNewest")}
        </button>
      </div>
      <div className="task-list-container">
      {isLoading ? (
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">{t('common.loading')}</span>
          </div>
          <p>{t('common.loading')}</p>
        </div>
      ) : (
        Object.entries(groupedTasks).map(([monthYear, tasks]) => (
          <div key={monthYear}>
            <h4 style={{ marginTop: "20px", color: "#555" }}>{monthYear}</h4>
            {tasks.map((task) => (
              <MDBCard
                key={task.id}
                style={{
                  backgroundColor: priorityColors[task.priority],
                  marginBottom: "15px",
                  position: "relative",
                  border: "3px solid #333",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                  overflow: "hidden"
                }}
              >
                <MDBCardBody className="Task">
                  <div className="task-header">
                    <MDBCardTitle>
                      {task.title}
                      <span
                        className="due-date-tag"
                        style={{
                          backgroundColor: new Date(task.due_date) < new Date() ? "var(--error)" : "var(--warning)",
                          color: "#fff",
                          fontSize: "12px",
                          padding: "5px 8px",
                          borderRadius: "5px",
                          marginLeft: "10px",
                        }}
                      >
                        📅 {t("crm.tasks.due")}: {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    </MDBCardTitle>
                    <MDBBtn
                      color="danger"
                      onClick={() => handleDeleteTask(task.id)}
                      className="delete-btn"
                    >
                      {t("crm.tasks.delete")}
                    </MDBBtn>
                  </div>
                  <MDBCardText className="task-description">{task.description}</MDBCardText>
                  <MDBCardText className="task-progress-text">
                    {t("crm.tasks.progress")}: <span className="progress-value">{task.progress}%</span>
                  </MDBCardText>

                  <div
                    style={{
                      position: "relative",
                      height: "20px",
                      backgroundColor: "var(--neutral-200)",
                      borderRadius: "10px",
                      cursor: "pointer",
                      border: "1px solid var(--border-light)",
                      overflow: "hidden"
                    }}
                    onMouseDown={(e) => {
                      const boundingRect = e.target.getBoundingClientRect();
                      const offsetX = e.clientX - boundingRect.left;
                      const newProgress = Math.min(100, Math.max(0, Math.round((offsetX / boundingRect.width) * 100)));
                      updateTaskProgress(task.id, newProgress);
                    }}
                    onMouseMove={(e) => {
                      if (e.buttons !== 1) return;
                      const boundingRect = e.target.getBoundingClientRect();
                      const offsetX = e.clientX - boundingRect.left;
                      const newProgress = Math.min(100, Math.max(0, Math.round((offsetX / boundingRect.width) * 100)));
                      updateTaskProgress(task.id, newProgress);
                    }}
                  >
                    <div
                      style={{
                        width: `${task.progress}%`,
                        height: "100%",
                        backgroundColor: 
                          task.progress < 30 ? "var(--error)" : 
                          task.progress < 70 ? "var(--warning)" : 
                          "var(--success)",
                        borderRadius: "10px",
                        transition: "width 0.2s ease-in-out",
                      }}
                    />
                  </div>
                </MDBCardBody>
              </MDBCard>
            ))}
          </div>
        ))
      )}
    </div>
    </MDBCol>
    </MDBRow>
  
    <Routes>
      <Route path="/login" element={<Login />} />
    </Routes>
    
    <UserChatBubble />
    
    {/* Task modal - moved outside of the main component tree to render properly */}
    {modalOpen && (
      <div className="modal-overlay">
        <div className="task-modal">
          <div className="task-modal-header">
            <h3>{t('crm.tasks.addTask')}</h3>
            <button 
              className="close-modal-btn"
              onClick={toggleModal}
              aria-label="Close"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="task-modal-content">
            <div className="form-group">
              <label htmlFor="taskTitle">{t('crm.tasks.taskName')}</label>
              <input
                id="taskTitle"
                type="text"
                placeholder={t('crm.tasks.taskName')}
                value={newTask.title}
                onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="taskDescription">{t('crm.tasks.taskDescription')}</label>
              <textarea
                id="taskDescription"
                placeholder={t('crm.tasks.taskDescription')}
                value={newTask.description}
                onChange={(e) => setNewTask((prev) => ({ ...prev, description: e.target.value }))}
                className="form-control"
                rows="4"
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="taskPriority">{t('crm.tasks.priority')}</label>
              <select
                id="taskPriority"
                value={newTask.priority}
                onChange={(e) => setNewTask((prev) => ({ ...prev, priority: e.target.value }))}
                className="form-control"
              >
                <option value="Low">{t('crm.tasks.low')}</option>
                <option value="Medium">{t('crm.tasks.medium')}</option>
                <option value="High">{t('crm.tasks.high')}</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="taskDueDate">{t('crm.tasks.dueDate')}</label>
              <DatePicker
                id="taskDueDate"
                selected={newTask.due_date ? new Date(newTask.due_date) : null}
                onChange={(date) => setNewTask((prev) => ({ 
                  ...prev, 
                  due_date: date ? format(new Date(date), 'yyyy-MM-dd') : null 
                }))}
                dateFormat="yyyy-MM-dd"
                placeholderText={t('crm.tasks.selectDueDate')}
                minDate={new Date()}
                className="form-control"
                wrapperClassName="date-picker-wrapper"
                popperClassName="date-picker-popper"
                popperPlacement="bottom"
                withPortal
              />
            </div>
          </div>
          
          <div className="task-modal-footer">
            <button 
              className="cancel-btn"
              onClick={toggleModal}
            >
              {t('modal.buttons.cancel')}
            </button>
            <button 
              className="save-btn"
              onClick={() => handleAddTask(newTask)}
              disabled={!newTask.title || !newTask.due_date}
            >
              {t('crm.tasks.addTask')}
            </button>
          </div>
        </div>
      </div>
    )}
  </MDBContainer>
  
)
}
