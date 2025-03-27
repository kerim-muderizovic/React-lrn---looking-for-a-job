import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useTranslation } from 'react-i18next';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBBadge,
  MDBBtn,
} from 'mdb-react-ui-kit';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axios from '../axiosConfig';

const Notification = () => {
  const { authUser } = useAuth();
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    // Initialize Pusher
    window.Pusher = Pusher;
    window.Echo = new Echo({
      broadcaster: 'pusher',
      key: import.meta.env.VITE_PUSHER_APP_KEY,
      cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
      forceTLS: true,
    });

    // Fetch initial notifications
    fetchNotifications();

    // Listen for new notifications
    const channel = window.Echo.private(`notifications.${authUser.user.id}`);
    
    channel.listen('NewNotification', (e) => {
      console.log('New notification received:', e);
      setNotifications(prev => [e.notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      channel.stopListening('NewNotification');
    };
  }, [authUser.user.id]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications');
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unread_count);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.post(`/api/notifications/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read_at: new Date().toISOString() }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.post('/api/notifications/mark-all-read');
      setNotifications(prev =>
        prev.map(notification => ({
          ...notification,
          read_at: new Date().toISOString(),
        }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <MDBContainer fluid className="notification-container">
      <MDBRow>
        <MDBCol size="12">
          <MDBCard className="notification-card">
            <MDBCardBody>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">
                  {t('notifications.title')}
                  {unreadCount > 0 && (
                    <MDBBadge color="danger" className="ms-2">
                      {unreadCount}
                    </MDBBadge>
                  )}
                </h5>
                <div>
                  <MDBBtn
                    color="link"
                    className="text-muted me-2"
                    onClick={() => setShowAll(!showAll)}
                  >
                    {showAll ? t('notifications.showLess') : t('notifications.showAll')}
                  </MDBBtn>
                  {unreadCount > 0 && (
                    <MDBBtn
                      color="link"
                      className="text-primary"
                      onClick={markAllAsRead}
                    >
                      {t('notifications.markAllRead')}
                    </MDBBtn>
                  )}
                </div>
              </div>

              <div className="notification-list">
                {notifications.slice(0, showAll ? undefined : 5).map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-item ${
                      !notification.read_at ? 'unread' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="d-flex align-items-start">
                      <MDBIcon
                        icon={getNotificationIcon(notification.type)}
                        className="me-2 mt-1"
                        size="lg"
                      />
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between">
                          <h6 className="mb-1">{notification.title}</h6>
                          <small className="text-muted">
                            {formatDate(notification.created_at)}
                          </small>
                        </div>
                        <p className="mb-1">{notification.message}</p>
                        {notification.data && (
                          <div className="notification-data">
                            {renderNotificationData(notification)}
                          </div>
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

const getNotificationIcon = (type) => {
  switch (type) {
    case 'task':
      return 'tasks';
    case 'message':
      return 'envelope';
    case 'system':
      return 'info-circle';
    default:
      return 'bell';
  }
};

const renderNotificationData = (notification) => {
  switch (notification.type) {
    case 'task':
      return (
        <div className="task-preview">
          <strong>{notification.data.task_name}</strong>
          <p className="mb-0">{notification.data.task_description}</p>
        </div>
      );
    case 'message':
      return (
        <div className="message-preview">
          <strong>{notification.data.sender_name}</strong>
          <p className="mb-0">{notification.data.message_preview}</p>
        </div>
      );
    default:
      return null;
  }
};

export default Notification; 