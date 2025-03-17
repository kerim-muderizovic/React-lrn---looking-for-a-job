import React, { useState } from 'react';
import axios from 'axios';
import './addNewTaskAdmin.css';
import { useTranslation } from 'react-i18next';

export default function AddNewTaskAdmin({ users }) {
  const { t } = useTranslation();
  
  // State for task details
  const [task, setTask] = useState({
    title: '',
    description: '',
    assignedUsers: [],
    progress: 0,
    priority: 'medium', // Default priority
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
    axios.post('http://localhost:8000/Admin/AddTask', task, { withCredentials: true, withXSRFToken: true })
      .then(response => {
        console.log('Task created:', response);
        // Clear the form after submission or handle success
        setTask({ 
          title: '', 
          description: '', 
          assignedUsers: [], 
          progress: 0,
          priority: 'medium'
        });
        // Close the modal
        setShowModal(false);
      })
      .catch(error => {
        console.error('Error creating task:', error);
        // Handle error
      });
  };

  // Toggle modal visibility
  const toggleModal = () => setShowModal(!showModal);

  // Helper function to get color based on priority
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <div className="add-task-container">
      <button className="add-task-btn" onClick={toggleModal}>
        <i className="fas fa-plus"></i> {t('admin.addNewTask')}
      </button>

      {/* Modal */}
      {showModal && (
        <div className="task-modal">
          <div className="task-modal-content">
            <div className="task-modal-header">
              <h2>{t('admin.addNewTask')}</h2>
              <button className="close-btn" onClick={toggleModal}>&times;</button>
            </div>
            <div className="task-modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>{t('crm.tasks.taskName')}</label>
                  <input
                    type="text"
                    name="title"
                    value={task.title}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>{t('crm.tasks.taskDescription')}</label>
                  <textarea
                    name="description"
                    value={task.description}
                    onChange={handleChange}
                    className="form-control"
                    rows="4"
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>{t('crm.tasks.priority')}</label>
                  <select
                    name="priority"
                    value={task.priority}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="low">{t('crm.tasks.low')}</option>
                    <option value="medium">{t('crm.tasks.medium')}</option>
                    <option value="high">{t('crm.tasks.high')}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>{t('admin.users')}</label>
                  <select
                    multiple
                    name="assignedUsers"
                    value={task.assignedUsers}
                    onChange={handleUserChange}
                    className="form-control"
                  >
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                  <small className="form-text text-muted">
                    Hold Ctrl (or Cmd) to select multiple users
                  </small>
                </div>

                <div className="form-group">
                  <label>{t('crm.tasks.progress')} ({task.progress}%)</label>
                  <input
                    type="range"
                    name="progress"
                    min="0"
                    max="100"
                    value={task.progress}
                    onChange={handleChange}
                    className="form-control-range"
                  />
                </div>

                <div className="task-modal-footer">
                  <button type="button" className="cancel-btn" onClick={toggleModal}>
                    {t('admin.cancel')}
                  </button>
                  <button type="submit" className="save-btn">
                    {t('modal.buttons.addTask')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
