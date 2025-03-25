import React, { useState } from 'react';
import axios from '../axiosConfig';
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
    deadline: '',
    difficulty: 3,
    importance: 3
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
    axios.post('/Admin/AddTask', task, { withXSRFToken: true })
      .then(response => {
        console.log('Task created:', response);
        // Clear the form after submission or handle success
        setTask({ 
          title: '', 
          description: '', 
          assignedUsers: [], 
          progress: 0,
          priority: 'medium',
          deadline: '',
          difficulty: 3,
          importance: 3
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

  // Close modal if clicking outside
  const handleModalBackdropClick = (e) => {
    if (e.target.classList.contains('task-modal-overlay')) {
      toggleModal();
    }
  };

  return (
    <div className="add-task-container">
      <button className="add-task-btn" onClick={toggleModal}>
        <i className="fas fa-plus-circle me-2"></i> {t('admin.addNewTask')}
      </button>

      {/* Modal */}
      {showModal && (
        <div className="task-modal-overlay" onClick={handleModalBackdropClick}>
          <div className="task-modal-wrapper">
            <div className="task-modal-content">
              <div className="task-modal-header">
                <h2>{t('admin.addNewTask')}</h2>
                <button className="close-btn" onClick={toggleModal}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="task-modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="title">{t('crm.tasks.taskName')}</label>
                    <input
                      id="title"
                      type="text"
                      name="title"
                      value={task.title}
                      onChange={handleChange}
                      required
                      className="form-control"
                      placeholder={t('crm.tasks.enterTaskName')}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">{t('crm.tasks.taskDescription')}</label>
                    <textarea
                      id="description"
                      name="description"
                      value={task.description}
                      onChange={handleChange}
                      className="form-control"
                      rows="4"
                      placeholder={t('crm.tasks.enterDescription')}
                    ></textarea>
                  </div>

                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="priority">{t('crm.tasks.priority')}</label>
                      <select
                        id="priority"
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
                    
                    <div className="form-group col-md-6">
                      <label htmlFor="deadline">{t('crm.tasks.deadline')}</label>
                      <input
                        id="deadline"
                        type="date"
                        name="deadline"
                        value={task.deadline}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="assignedUsers">{t('admin.users')}</label>
                    <select
                      id="assignedUsers"
                      multiple
                      name="assignedUsers"
                      value={task.assignedUsers}
                      onChange={handleUserChange}
                      className="form-control"
                    >
                      {users && users.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                    <small className="form-text text-muted">
                      {t('admin.holdCtrlToSelectMultiple')}
                    </small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="progress">
                      {t('crm.tasks.progress')} ({task.progress}%)
                    </label>
                    <input
                      id="progress"
                      type="range"
                      name="progress"
                      min="0"
                      max="100"
                      value={task.progress}
                      onChange={handleChange}
                      className="form-control-range"
                    />
                    <div className="progress">
                      <div 
                        className="progress-bar" 
                        role="progressbar" 
                        style={{ 
                          width: `${task.progress}%`,
                          backgroundColor: 
                            task.progress < 30 ? '#dc3545' : 
                            task.progress < 70 ? '#ffc107' : 
                            '#28a745'
                        }} 
                        aria-valuenow={task.progress} 
                        aria-valuemin="0" 
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>

                  <div className="task-modal-footer">
                    <button type="button" className="cancel-btn" onClick={toggleModal}>
                      {t('admin.cancel')}
                    </button>
                    <button type="submit" className="save-btn">
                      {t('admin.addNewTask')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
