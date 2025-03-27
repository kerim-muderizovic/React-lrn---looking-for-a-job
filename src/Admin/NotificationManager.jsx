import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBInput,
  MDBTextArea,
  MDBIcon,
//   MDBAlert,
} from 'mdb-react-ui-kit';
import axios from '../axiosConfig';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const NotificationManager = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [notification, setNotification] = useState({
    title: '',
    message: '',
    type: 'system',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchUsers();
    initializeEcho();
  }, []);

  const initializeEcho = () => {
    window.Pusher = Pusher;
    window.Echo = new Echo({
      broadcaster: 'pusher',
      key: import.meta.env.VITE_PUSHER_APP_KEY,
      cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
      forceTLS: true,
    });
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/user/getAll');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(t('notifications.fetchUsersError'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post('/api/notifications', {
        user_id: selectedUser,
        ...notification,
      });

      if (response.status === 200) {
        setSuccess(true);
        setNotification({
          title: '',
          message: '',
          type: 'system',
        });
        setSelectedUser('');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      setError(error.response?.data?.message || t('notifications.sendError'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNotification(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <MDBContainer fluid>
      <MDBRow>
        <MDBCol size="12">
          <MDBCard>
            <MDBCardBody>
              <h4 className="mb-4">{t('notifications.sendNotification')}</h4>

              {error && (
                <MDBAlert color="danger" className="mb-3">
                  {error}
                </MDBAlert>
              )}

              {success && (
                <MDBAlert color="success" className="mb-3">
                  {t('notifications.sentSuccess')}
                </MDBAlert>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">{t('notifications.selectUser')}</label>
                  <select
                    className="form-select"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    required
                  >
                    <option value="">{t('notifications.selectUserPlaceholder')}</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <MDBInput
                    label={t('notifications.title')}
                    name="title"
                    value={notification.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <MDBTextArea
                    label={t('notifications.message')}
                    name="message"
                    value={notification.message}
                    onChange={handleChange}
                    rows={4}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">{t('notifications.type')}</label>
                  <select
                    className="form-select"
                    name="type"
                    value={notification.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="system">{t('notifications.typeSystem')}</option>
                    <option value="task">{t('notifications.typeTask')}</option>
                    <option value="message">{t('notifications.typeMessage')}</option>
                  </select>
                </div>

                <MDBBtn
                  type="submit"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <MDBIcon icon="spinner" spin className="me-2" />
                      {t('notifications.sending')}
                    </>
                  ) : (
                    <>
                      <MDBIcon icon="paper-plane" className="me-2" />
                      {t('notifications.send')}
                    </>
                  )}
                </MDBBtn>
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default NotificationManager; 