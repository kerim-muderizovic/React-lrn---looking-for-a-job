import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axios from '../axiosConfig';

// Make Pusher available globally
window.Pusher = Pusher;

/**
 * Create and configure a Laravel Echo instance
 * @returns {Echo} Configured Echo instance
 */
export const createEchoInstance = () => {
  // Pusher key and cluster - hardcoded for reliability
  const PUSHER_KEY = '1095a51e72cc082abbab';
  const PUSHER_CLUSTER = 'eu';
  
  // Get the CSRF token from the meta tag
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  console.log('Creating Echo instance with key:', PUSHER_KEY, 'CSRF Token:', csrfToken);
  
  // Get Laravel session cookie
  const sessionCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('laravel_session='))
    ?.split('=')[1];
  
  console.log('Session cookie found:', !!sessionCookie);
  
  return new Echo({
    broadcaster: 'pusher',
    key: PUSHER_KEY,
    cluster: PUSHER_CLUSTER,
    forceTLS: true,
    encrypted: true,
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
    authEndpoint: '/broadcasting/auth', // Use relative URL
    csrfToken: csrfToken,
    auth: {
      headers: {
        'X-CSRF-TOKEN': csrfToken,
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    },
    authorizer: (channel, options) => {
      return {
        authorize: (socketId, callback) => {
          axios.post('/broadcasting/auth', {
            socket_id: socketId,
            channel_name: channel.name
          }, {
            headers: {
              'X-CSRF-TOKEN': csrfToken,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            }
          })
          .then(response => {
            callback(false, response.data);
          })
          .catch(error => {
            console.error('Auth Error:', error);
            callback(true, error);
          });
        }
      };
    }
  });
}; 