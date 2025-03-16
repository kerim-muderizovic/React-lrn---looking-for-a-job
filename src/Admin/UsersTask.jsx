import React, { useState } from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn,
} from 'mdb-react-ui-kit';
import EditModal from './EditModal';
import './UsersTask.css';
export default function UserTask({ users, tasks, startChat, openEditModal, handleDeleteUser, handleDeleteTask }) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editType, setEditType] = useState('');
  const [currentEditData, setCurrentEditData] = useState(null);
  const showDescription = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const toggleModal = () => {
    setModalOpen(false);
    setSelectedTask(null);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const saveChanges = () => {
    // Handle saving logic
    closeEditModal();
  };


  return (

  
    <div className='UsersTask'>
    <MDBContainer className="main-content">
      <h1 className="UserH">User Management</h1>
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
                  <button className="btn btn-info" onClick={() => startChat(user.id)}>
    Chat
  </button>
  <button
    className="btn btn-primary me-2"
    onClick={() => openEditModal("user", user)}
  >
    Edit
  </button>
  <button
    className="btn btn-danger"
    onClick={() => {
      handleDeleteUser(user.id);
      console.log("Delete button clicked for task:", user);
    }}
  >
    Delete
  </button>
  {!user.approvedByAdmin && (
    <button className="btn btn-warning">Approve</button>
  )}
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
                <th>Description</th>
                <th>Assigned User</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {tasks.map((task, index) => (
                <tr key={task.id}>
                  <td>{index + 1}</td>
                  <td>{task.title}</td>
                  <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => showDescription(task)}
                  >
                    Show Description
                  </button>
                  </td>
                  <td>
                    {(task.users || []).length > 0
                      ? task.users.map((user) => user.name).join(', ')
                      : 'No users assigned'}
                  </td>
                  <td>{task.progress} %</td>
                  <td>
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => openEditModal("task", task)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    Delete
                  </button>
                  </td>
                </tr>
              ))}
            </MDBTableBody>
          </MDBTable>
        </MDBCol>
      </MDBRow>

      {/* Edit Modal */}
   
      {/* Task Description Modal */}
      {selectedTask && (
        <div className={`modal fade ${modalOpen ? 'show d-block' : ''}`} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Task Description - {selectedTask.title}
                </h5>
              </div>
              <div className="modal-body">
                {selectedTask.description ? selectedTask.description : 'No description available.'}
              </div>
              <div className="modal-footer">
                                <button
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
    </MDBContainer>
    </div>
  );
}
