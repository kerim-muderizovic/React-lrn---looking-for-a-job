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
import './crmMainPart.css';

export default function CRMApp() {
  const [tasks, setTasks] = useState([
    { name: "Task 1", progress: 50 },
    { name: "Task 2", progress: 75 },
  ]);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
          withCredentials: true,
        });

        const authResponse = await axios.get("http://localhost:8000/auth/check", {
          withCredentials: true,
        });

        setIsAuthenticated(authResponse.data.isLoggedIn);

        if (authResponse.data.isLoggedIn) {
          setUser(authResponse.data.user);
        }
      } catch (error) {
        console.error("Error checking authentication status:", error);
        setIsAuthenticated(false);
      } finally {
        setAuthChecked(true);
      }
    };

    fetchAuthStatus();
  }, []);

  const addTask = () => {
    if (!isAuthenticated) {
      alert("You must be logged in to add a task.");
      return;
    }

    const newTaskName = prompt("Enter task name:", "New Task");
    if (newTaskName) {
      setTasks([...tasks, { name: newTaskName, progress: 0 }]);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  if (!authChecked) {
    return <div>Loading...</div>;
  }

  return (
    <MDBContainer fluid className="vh-100">
      {!isAuthenticated && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(5px)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            flexDirection: "column",
          }}
        >
          <h2>You must be logged in to access this page.</h2>
          <MDBBtn color="primary" onClick={handleLogin}>
            Log in
          </MDBBtn>
        </div>
      )}

      <MDBRow className="h-100">
        <MDBCol size="3" className="bg-light p-3">
          <MDBNavbar light bgColor="light" className="flex-column h-100">
            {user && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <img onClick={() => navigate("/user-profile")} className="imgProfile"
                  src={user.profilePicture || "/default-avatar.png"}
                  alt={`${user.name}'s profile`}
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    marginBottom: "10px",
                  }}
                />
                <h5>{user.name}</h5>
                <p style={{ fontSize: "0.9rem", color: "gray" }}>
                  {user.role || "User"}
                </p>
              </div>
            )}
            <MDBNavbarBrand>CRM</MDBNavbarBrand>
            <MDBBtn
              color="primary"
              className="mt-3 w-100"
              onClick={addTask}
            >
              + Add Task
            </MDBBtn>
          </MDBNavbar>
        </MDBCol>

        <MDBCol size="9" className="p-4">
          <h2 className="mb-4">Tasks</h2>
          <MDBRow>
            {tasks.map((task, index) => (
              <MDBCol md="6" key={index} className="mb-4">
                <MDBCard>
                  <MDBCardBody>
                    <MDBCardTitle>{task.name}</MDBCardTitle>
                    <MDBCardText>Progress: {task.progress}%</MDBCardText>
                    <MDBProgress>
                      <MDBProgressBar
                        width={task.progress}
                        valuemin={0}
                        valuemax={100}
                      />
                    </MDBProgress>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            ))}
          </MDBRow>
        </MDBCol>
      </MDBRow>

      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </MDBContainer>
  );
}
