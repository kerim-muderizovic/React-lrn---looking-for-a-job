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
} from 'mdb-react-ui-kit';
import './AdminPage.css'; // Optional CSS file for custom styles

export default function AdminPage() {
  // State to store users and tasks data
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);

  // Fetch users and tasks data on component mount
  useEffect(() => {
    // Replace 'users_url' and 'tasks_url' with actual API endpoints
    axios.get('http://localhost:8000/user/getAll') // URL for users data
      .then(response => {
        setUsers(response.data); // Set users data to state
      })
      .catch(error => console.error('Error fetching users:', error));

      axios.get('http://localhost:8000/getAllTasks') // URL for tasks data
      .then(response => {
        // Check if response contains tasks array
        if (response.data && Array.isArray(response.data.tasks)) {
          setTasks(response.data.tasks); // Set tasks data from the 'tasks' key
        } else {
          console.error('Expected an array of tasks, but got:', response.data);
        }
      })
      .catch(error => console.error('Error fetching tasks:', error));
  }, []); // Empty dependency array to run once on mount

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
                {users.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <MDBBtn size="sm" color="primary" className="me-2">
                        Edit
                      </MDBBtn>
                      <MDBBtn size="sm" color="danger">
                        Delete
                      </MDBBtn>
                      <MDBBtn size="sm" color="warning">
                        Approve
                      </MDBBtn>
                    </td>
                  </tr>
                ))}
              </MDBTableBody>
            </MDBTable>
          </MDBCol>
        </MDBRow>

        <h2 className="my-4">Task Management</h2>
        <MDBRow>
          <MDBCol>
            <MDBTable responsive striped hover>
              <MDBTableHead>
                <tr>
                  <th>#</th>
                  <th>Task Name</th>
                  <th>Assigned User</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {tasks.map((task, index) => (
                  <tr key={task.id}>
                    <td>{index + 1}</td>
                    <td>{task.name}</td>
                    <td>{task.assignedUser}</td>
                    <td>{task.status}</td>
                    <td>
                      <MDBBtn size="sm" color="primary" className="me-2">
                        Edit
                      </MDBBtn>
                      <MDBBtn size="sm" color="danger">
                        Delete
                      </MDBBtn>
                    </td>
                  </tr>
                ))}
              </MDBTableBody>
            </MDBTable>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}
