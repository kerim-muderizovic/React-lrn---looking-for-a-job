import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBBadge,
  MDBIcon,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from 'mdb-react-ui-kit';
import axios from '../axiosConfig';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const NotificationCenter = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
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

    // Listen for new notifications
    window.Echo.private('notifications')
      .notification((notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      });
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications');
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.read_at).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError(t('notifications.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read_at: new Date() } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/mark-all-read');
      setNotifications(prev =>
        prev.map(n => ({ ...n, read_at: n.read_at || new Date() }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'task':
        return 'tasks';
      case 'message':
        return 'envelope';
      default:
        return 'bell';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'task':
        return 'primary';
      case 'message':
        return 'success';
      default:
        return 'info';
    }
  };

  return (
    <MDBDropdown>
      <MDBDropdownToggle tag="a" className="nav-link">
        <MDBIcon icon="bell" className="me-2" />
        {unreadCount > 0 && (
          <MDBBadge color="danger" className="ms-2">
            {unreadCount}
          </MDBBadge>
        )}
      </MDBDropdownToggle>
      <MDBDropdownMenu className="dropdown-menu-end notification-dropdown">
        <div className="d-flex justify-content-between align-items-center p-2 border-bottom">
          <h6 className="mb-0">{t('notifications.title')}</h6>
          {unreadCount > 0 && (
            <MDBBtn
              size="sm"
              color="link"
              className="text-primary"
              onClick={markAllAsRead}
            >
              {t('notifications.markAllRead')}
            </MDBBtn>
          )}
        </div>
        <div className="notification-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {notifications.length === 0 ? (
            <div className="p-3 text-center text-muted">
              {t('notifications.noNotifications')}
            </div>
          ) : (
            notifications.map(notification => (
              <MDBDropdownItem
                key={notification.id}
                className={`notification-item ${!notification.read_at ? 'unread' : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="d-flex align-items-center">
                  <MDBIcon
                    icon={getNotificationIcon(notification.type)}
                    className={`text-${getNotificationColor(notification.type)} me-2`}
                  />
                  <div>
                    <div className="fw-bold">{notification.title}</div>
                    <div className="small text-muted">{notification.message}</div>
                    <div className="small text-muted">
                      {new Date(notification.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              </MDBDropdownItem>
            ))
          )}
        </div>
        {notifications.length > 0 && (
          <div className="p-2 border-top text-center">
            <MDBBtn
              size="sm"
              color="link"
              className="text-primary"
              onClick={() => window.location.href = '/notifications'}
            >
              {t('notifications.viewAll')}
            </MDBBtn>
          </div>
        )}
      </MDBDropdownMenu>
    </MDBDropdown>
  );
};

export default NotificationCenter; 