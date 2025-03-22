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
  
  console.log('Creating Echo instance with key:', PUSHER_KEY);
  
  return new Echo({
    broadcaster: 'pusher',
    key: PUSHER_KEY,
    cluster: PUSHER_CLUSTER,
    forceTLS: true,
    encrypted: true,
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
    authEndpoint: `${axios.defaults.baseURL}/broadcasting/auth`,
    auth: {
      headers: {
        withCredentials: true,
        withXSRFToken: true,
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
      },
    },
  });
}; 