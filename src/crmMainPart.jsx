import React, { useState, useEffect } from "react";
import axios from "axios";
import { Route, Routes } from "react-router-dom"; // Import React Router
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
  MDBProgressBar
} from "mdb-react-ui-kit";
import Login from "./login";
export default function CRMApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tasks, setTasks] = useState([
    { name: "Task 1", progress: 50 },
    { name: "Task 2", progress: 75 },
  ]);

  // Check if the user is logged in
  useEffect(() => {
    axios.get("/auth/check")
      .then((response) => {
        if (response.data.isLoggedIn) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch((error) => {
        console.error("Error checking authentication status", error);
        setIsLoggedIn(false);
      });
  }, []);

  const addTask = () => {
    if (!isLoggedIn) {
      alert("You must be logged in to add a task.");
      return;
    }

    const newTaskName = prompt("Enter task name:", "New Task");
    if (newTaskName) {
      setTasks([...tasks, { name: newTaskName, progress: 0 }]);
    }
  };

  const handleLogin = () => {
    // Redirect to the login page using React Router
    window.location.href = "/login";  // React Router handles this for you
  };

  return (
    <MDBContainer fluid className="vh-100">
      {/* Overlay when user is not logged in */}
      {!isLoggedIn && (
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
        {/* Left Navbar Section */}
        <MDBCol size="3" className="bg-light p-3">
          <MDBNavbar light bgColor="light" className="flex-column h-100">
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

        {/* Right Task Section */}
        <MDBCol size="9" className="p-4">
          <h2 className="mb-4">Tasks</h2>
          <MDBRow>
            {tasks.map((task, index) => (
              <MDBCol md="6" key={index} className="mb-4">
                <MDBCard>
                  <MDBCardBody>
                    <MDBCardTitle>{task.name}</MDBCardTitle>
                    <MDBCardText>
                      Progress: {task.progress}%
                    </MDBCardText>
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

      {/* Add the Routes for the login page outside this component */}
      {/* Ensure this is in a parent Router component, typically in App.js */}
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </MDBContainer>
  );
}
