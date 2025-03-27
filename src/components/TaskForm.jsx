import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useOffline } from '../hooks/useOffline';
import {
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBBtn,
  MDBInput,
  MDBTextArea,
  MDBSelect,
  MDBAlert,
} from 'mdb-react-ui-kit';
import axios from '../axiosConfig';

const TaskForm = ({ isOpen, onClose, onTaskCreated, initialData = null }) => {
  const { t } = useTranslation();
  const { isOnline, createOfflineTask } = useOffline();
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || 'pending',
    priority: initialData?.priority || 'medium',
    due_date: initialData?.due_date || '',
    assigned_to: initialData?.assigned_to || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!isOnline) {
        // Create task offline
        const offlineTask = await createOfflineTask(formData);
        onTaskCreated(offlineTask);
        onClose();
      } else {
        // Create task online
        const response = await axios.post('/api/tasks', formData);
        onTaskCreated(response.data);
        onClose();
      }
    } catch (error) {
      setError(error.message || t('tasks.createError'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <MDBModal show={isOpen} onHide={onClose} tabIndex="-1">
      <MDBModalDialog>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>
              {initialData ? t('tasks.editTask') : t('tasks.createTask')}
            </MDBModalTitle>
            <MDBBtn
              color="link"
              className="btn-close"
              onClick={onClose}
            ></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            {!isOnline && (
              <MDBAlert color="warning" className="mb-3">
                {t('tasks.offlineMode')}
              </MDBAlert>
            )}
            {error && (
              <MDBAlert color="danger" className="mb-3">
                {error}
              </MDBAlert>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <MDBInput
                  label={t('tasks.title')}
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <MDBTextArea
                  label={t('tasks.description')}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
              <div className="mb-3">
                <MDBSelect
                  label={t('tasks.status')}
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  options={[
                    { text: t('tasks.statusPending'), value: 'pending' },
                    { text: t('tasks.statusInProgress'), value: 'in_progress' },
                    { text: t('tasks.statusCompleted'), value: 'completed' },
                  ]}
                />
              </div>
              <div className="mb-3">
                <MDBSelect
                  label={t('tasks.priority')}
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  options={[
                    { text: t('tasks.priorityLow'), value: 'low' },
                    { text: t('tasks.priorityMedium'), value: 'medium' },
                    { text: t('tasks.priorityHigh'), value: 'high' },
                  ]}
                />
              </div>
              <div className="mb-3">
                <MDBInput
                  label={t('tasks.dueDate')}
                  name="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <MDBInput
                  label={t('tasks.assignedTo')}
                  name="assigned_to"
                  value={formData.assigned_to}
                  onChange={handleChange}
                />
              </div>
            </form>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={onClose}>
              {t('common.cancel')}
            </MDBBtn>
            <MDBBtn
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? t('common.saving') : t('common.save')}
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};

export default TaskForm; 