import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AddNewTaskAdmin({ users }) {
  // State for task details
  const [task, setTask] = useState({
    title: '',
    description: '',
    assignedUsers: [],
    progress: 0,
    priority: '', // Add priority here
  });

  // Modal open state
  const [showModal, setShowModal] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({
      ...task,
      [name]: value
    });
  };

  // Handle assigned users change (multi-select)
  const handleUserChange = (e) => {
    const selectedUsers = Array.from(e.target.selectedOptions, option => option.value);
    setTask({
      ...task,
      assignedUsers: selectedUsers
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Post task data to backend
    axios.post('http://localhost:8000/Admin/AddTask', task, { withCredentials: true,withXSRFToken:true })
      .then(response => {
        console.log('Task created:', response);
        // Clear the form after submission or handle success
        setTask({ title: '', description: '', assignedUsers: [], progress: 0 });
        setShowModal(false);  // Close the modal
      })
      .catch(error => {
        console.error('Error creating task:', error);
      });
  };

  // Toggle modal visibility
  const toggleModal = () => setShowModal(!showModal);

  return (
    <>
      {/* Button to trigger the modal */}
      <button type="button" className="btn btn-primary" onClick={toggleModal}>
        Add New Task
      </button>

      {/* Modal */}
      {showModal && (
        <div className="modal show" tabIndex="-1" style={{ display: 'block' }} aria-labelledby="taskModalLabel" aria-hidden="false">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="taskModalLabel">Add New Task</h5>
                <button type="button" className="btn-close" onClick={toggleModal} aria-label="Close"></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {/* Task Title */}
                  <div className="mb-3">
                    <label htmlFor="taskTitle" className="form-label">Task Title</label>
                    <input
                      id="taskTitle"
                      className="form-control"
                      type="text"
                      name="title"
                      value={task.title}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Task Description */}
                  <div className="mb-3">
                    <label htmlFor="taskDescription" className="form-label">Description</label>
                    <textarea
                      id="taskDescription"
                      className="form-control"
                      rows="4"
                      name="description"
                      value={task.description}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
  <label htmlFor="taskPriority" className="form-label">Priority</label>
  <select
    id="taskPriority"
    className="form-select"
    name="priority"
    value={task.priority}
    onChange={handleChange}
  >
    <option value="">Select Priority</option>
    <option value="low">Low</option>
    <option value="medium">Medium</option>
    <option value="high">High</option>
  </select>
</div>


                  {/* Assigned Users */}
                  <div className="mb-3">
                    <label htmlFor="assignedUsers" className="form-label">Assign Users</label>
                    <select
                      id="assignedUsers"
                      className="form-select"
                      name="assignedUsers"
                      multiple
                      value={task.assignedUsers}
                      onChange={handleUserChange}
                    >
                      {users.filter((x)=>x.role!='admin').map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Task Progress */}
                  <div className="mb-3">
                    <label htmlFor="taskProgress" className="form-label">Progress</label>
                    <input
                      id="taskProgress"
                      className="form-control"
                      type="number"
                      name="progress"
                      value={task.progress}
                      min="0"
                      max="100"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={toggleModal}>Close</button>
                  <button type="submit" className="btn btn-primary">Add Task</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Backdrop */}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </>
  );
}
