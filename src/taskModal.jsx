import React, { useState, useEffect } from "react";
import {
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
  MDBBtn,
} from "mdb-react-ui-kit";
import axios from "axios";

export default function AddTaskModal({ toggle, isOpen, onTaskAdded }) {
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [users, setUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await axios.get("http://localhost:8000/sanctum/csrf-cookie", { withCredentials: true });
        const { data } = await axios.get("http://localhost:8000/assignable-users", {
          withCredentials: true,
        });
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (isOpen) fetchUsers(); // Fetch users only when modal is open
  }, [isOpen]);

  const handleSubmit = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:8000/postTask",
        { title: taskName, priority, assigned_users: assignedUsers },
        { withCredentials: true }
      );

      onTaskAdded(data.task);
      toggle();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <MDBModal show={isOpen} setShow={toggle}>
      <MDBModalHeader>Test Modal</MDBModalHeader>
      <MDBModalBody>
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Task Name"
        />
      </MDBModalBody>
      <MDBModalFooter>
        <MDBBtn onClick={handleSubmit}>Add Task</MDBBtn>
        <MDBBtn color="secondary" onClick={toggle}>
          Close
        </MDBBtn>
      </MDBModalFooter>
    </MDBModal>
  );
}
