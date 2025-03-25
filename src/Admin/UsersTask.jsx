import React, { useState } from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from 'mdb-react-ui-kit';
import './UsersTask.css';
import { useTranslation } from 'react-i18next';

export default function UserTask({ 
  users, 
  tasks, 
  startChat, 
  openEditModal, 
  handleDeleteUser, 
  handleDeleteTask,
  handleApproveUser 
}) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation();

  const showDescription = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const toggleModal = () => {
    setModalOpen(false);
    setSelectedTask(null);
  };

  // Add backdrop click handler for modal
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('modal')) {
      toggleModal();
    }
  };

  // Handle opening the edit modal
  const handleOpenEditModal = (type, data) => {
    console.log(`Opening ${type} edit modal with data:`, data);
    if (!data || !data.id) {
      console.error('Invalid data for edit modal');
      return;
    }
    
    // Create a copy of the data to avoid reference issues
    const dataCopy = JSON.parse(JSON.stringify(data));
    
    // Add debug information
    console.log('Debug: About to call openEditModal with:', {
      type,
      dataCopy
    });
    
    // Call the openEditModal function from props
    openEditModal(type, dataCopy);
    
    // Confirm the call has been made
    console.log('Debug: openEditModal called');
  };

  return (
    <div className='UsersTask'>
      <MDBContainer className="main-content">
        <h1 className="UserH">{t('admin.users')}</h1>
        <MDBRow>
          <MDBCol>
            <MDBTable responsive striped hover>
              <MDBTableHead>
                <tr>
                  <th>#</th>
                  <th>{t('admin.name')}</th>
                  <th>{t('admin.email')}</th>
                  <th>{t('admin.role')}</th>
                  <th>{t('admin.actions')}</th>
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
                      <div className="button-group">
                        <button 
                          className="btn btn-info" 
                          onClick={() => startChat(user.id)}
                          title={t('chat.openChat')}
                        >
                          <i className="fas fa-comment-alt mr-1"></i> {t('chat.openChat')}
                        </button>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleOpenEditModal("user", user)}
                          title={t('admin.editUser')}
                        >
                          <i className="fas fa-edit mr-1"></i> {t('admin.editUser')}
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteUser(user.id)}
                          title={t('admin.deleteUser')}
                        >
                          <i className="fas fa-trash-alt mr-1"></i> {t('admin.deleteUser')}
                        </button>
                        {!user.approvedByAdmin && (
                          <button 
                            className="btn btn-warning"
                            onClick={() => handleApproveUser(user.id)}
                            title={t('admin.approveUser')}
                          >
                            <i className="fas fa-check mr-1"></i> {t('admin.approveUser', 'Approve')}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </MDBTableBody>
            </MDBTable>
          </MDBCol>
        </MDBRow>

        <h2 className="UserH my-4">{t('admin.tasks')}</h2>
        <MDBRow>
          <MDBCol>
            <MDBTable responsive striped hover>
              <MDBTableHead>
                <tr>
                  <th>#</th>
                  <th>{t('crm.tasks.taskName')}</th>
                  <th>{t('admin.description')}</th>
                  <th>{t('admin.assignedUsers', 'Assigned Users')}</th>
                  <th>{t('crm.tasks.progress')}</th>
                  <th>{t('admin.actions')}</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {tasks.map((task, index) => (
                  <tr key={task.id}>
                    <td>{index + 1}</td>
                    <td>{task.title}</td>
                    <td>
                      <button
                        className="btn btn-info"
                        onClick={() => showDescription(task)}
                        title={t('admin.viewDetails', 'View Details')}
                      >
                        <i className="fas fa-eye mr-1"></i> {t('admin.viewDetails', 'View')}
                      </button>
                    </td>
                    <td>
                      {(task.users || []).length > 0
                        ? task.users.map((user) => user.name).join(', ')
                        : t('admin.noUsersAssigned', 'No users assigned')}
                    </td>
                    <td>
                      <div className="progress" style={{ height: '20px' }}>
                        <div 
                          className="progress-bar" 
                          role="progressbar" 
                          style={{ 
                            width: `${task.progress}%`,
                            backgroundColor: 
                              task.progress < 30 ? 'var(--error)' : 
                              task.progress < 70 ? 'var(--warning)' : 
                              'var(--success)'
                          }} 
                          aria-valuenow={task.progress} 
                          aria-valuemin="0" 
                          aria-valuemax="100"
                        >
                          {task.progress}%
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="button-group">
                        <button
                          className="btn btn-primary"
                          onClick={() => handleOpenEditModal("task", task)}
                          title={t('admin.editTask')}
                        >
                          <i className="fas fa-edit mr-1"></i> {t('admin.editTask')}
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteTask(task.id)}
                          title={t('admin.deleteTask')}
                        >
                          <i className="fas fa-trash-alt mr-1"></i> {t('admin.deleteTask')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </MDBTableBody>
            </MDBTable>
          </MDBCol>
        </MDBRow>

        {/* Task Description Modal */}
        {selectedTask && (
          <div 
            className={`modal fade ${modalOpen ? 'show d-block' : ''}`} 
            tabIndex="-1"
            onClick={handleBackdropClick}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {t('admin.taskDetails', 'Task Details')}: {selectedTask.title}
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={toggleModal}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <h6>{t('admin.description')}:</h6>
                  <p>{selectedTask.description ? selectedTask.description : t('admin.noDescriptionAvailable', 'No description available.')}</p>
                  
                  <h6 className="mt-3">{t('crm.tasks.progress')}:</h6>
                  <div className="progress" style={{ height: '20px' }}>
                    <div 
                      className="progress-bar" 
                      role="progressbar" 
                      style={{ 
                        width: `${selectedTask.progress}%`,
                        backgroundColor: 
                          selectedTask.progress < 30 ? 'var(--error)' : 
                          selectedTask.progress < 70 ? 'var(--warning)' : 
                          'var(--success)'
                      }} 
                      aria-valuenow={selectedTask.progress} 
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    >
                      {selectedTask.progress}%
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={toggleModal}
                  >
                    {t('admin.close', 'Close')}
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
