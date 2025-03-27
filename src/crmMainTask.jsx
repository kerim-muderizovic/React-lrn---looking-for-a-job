import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useOffline } from './hooks/useOffline';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBInput,
  MDBTextArea,
  MDBSelect,
  MDBAlert,
  MDBSpinner,
} from 'mdb-react-ui-kit';
import axios from './axiosConfig';

const CrmMainTask = () => {
  const { t } = useTranslation();
  const { isOnline, createOfflineTask, pendingTasks } = useOffline();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    due_date: '',
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks');
      setTasks(response.data);
    } catch (error) {
      setError(t('tasks.fetchError'));
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!isOnline) {
        // Create task offline
        const offlineTask = await createOfflineTask(formData);
        setTasks(prev => [...prev, offlineTask]);
        setShowForm(false);
        setFormData({
          title: '',
          description: '',
          status: 'pending',
          priority: 'medium',
          due_date: '',
        });
      } else {
        // Create task online
        const response = await axios.post('/api/tasks', formData);
        setTasks(prev => [...prev, response.data]);
        setShowForm(false);
        setFormData({
          title: '',
          description: '',
          status: 'pending',
          priority: 'medium',
          due_date: '',
        });
      }
    } catch (error) {
      setError(error.response?.data?.message || t('tasks.createError'));
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <MDBSpinner />
      </div>
    );
  }

  return (
    <MDBContainer fluid>
      <MDBRow>
        <MDBCol size="12">
          <MDBCard>
            <MDBCardBody>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>{t('tasks.title')}</h4>
                <MDBBtn color="primary" onClick={() => setShowForm(!showForm)}>
                  {showForm ? t('tasks.cancel') : t('tasks.addTask')}
                </MDBBtn>
              </div>

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

              {showForm && (
                <form onSubmit={handleSubmit} className="mb-4">
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
                  <MDBBtn type="submit" color="primary" disabled={loading}>
                    {loading ? t('common.saving') : t('common.save')}
                  </MDBBtn>
                </form>
              )}

              {/* Display pending offline tasks */}
              {pendingTasks.length > 0 && (
                <div className="mb-4">
                  <h5>{t('tasks.pendingTasks')}</h5>
                  {pendingTasks.map(task => (
                    <div key={task.id} className="card mb-2">
                      <div className="card-body">
                        <h6 className="card-title">{task.title}</h6>
                        <p className="card-text">{task.description}</p>
                        <small className="text-muted">
                          {t('tasks.offlineTask')}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Display online tasks */}
              <div className="task-list">
                {tasks.map(task => (
                  <div key={task.id} className="card mb-2">
                    <div className="card-body">
                      <h6 className="card-title">{task.title}</h6>
                      <p className="card-text">{task.description}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <span className={`badge bg-${getStatusColor(task.status)} me-2`}>
                            {t(`tasks.status${task.status}`)}
                          </span>
                          <span className={`badge bg-${getPriorityColor(task.priority)}`}>
                            {t(`tasks.priority${task.priority}`)}
                          </span>
                        </div>
                        {task.due_date && (
                          <small className="text-muted">
                            {t('tasks.dueDate')}: {new Date(task.due_date).toLocaleDateString()}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'in_progress':
      return 'info';
    case 'completed':
      return 'success';
    default:
      return 'secondary';
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'low':
      return 'success';
    case 'medium':
      return 'warning';
    case 'high':
      return 'danger';
    default:
      return 'secondary';
  }
};

export default CrmMainTask; 