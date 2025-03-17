import React, { useState } from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from 'mdb-react-ui-kit';
import editModal from './editModal';
import './UsersTask.css';
import { useTranslation } from 'react-i18next';

export default function UserTask({ users, tasks, startChat, openEditModal, handleDeleteUser, handleDeleteTask }) {
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
                        >
                          <i className="fas fa-comment-alt mr-1"></i> {t('admin.startChat')}
                        </button>
                        <button
                          className="btn btn-primary"
                          onClick={() => openEditModal("user", user)}
                        >
                          <i className="fas fa-edit mr-1"></i> {t('admin.editUser')}
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <i className="fas fa-trash-alt mr-1"></i> {t('admin.deleteUser')}
                        </button>
                        {!user.approvedByAdmin && (
                          <button className="btn btn-warning">
                            <i className="fas fa-check mr-1"></i> Approve
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
                  <th>{t('crm.tasks.priority')}</th>
                  <th>{t('admin.description')}</th>
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
                      >
                        <i className="fas fa-eye mr-1"></i> View
                      </button>
                    </td>
                    <td>
                      {(task.users || []).length > 0
                        ? task.users.map((user) => user.name).join(', ')
                        : 'No users assigned'}
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
                          onClick={() => openEditModal("task", task)}
                        >
                          <i className="fas fa-edit mr-1"></i> Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <i className="fas fa-trash-alt mr-1"></i> Delete
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
                    Task Details: {selectedTask.title}
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={toggleModal}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <h6>Description:</h6>
                  <p>{selectedTask.description ? selectedTask.description : 'No description available.'}</p>
                  
                  <h6 className="mt-3">Progress:</h6>
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
