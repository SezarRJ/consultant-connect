import { useEffect } from 'react';
import { useAppStore } from '@/store/appStore';

export const useNotifications = () => {
  const addNotification = useAppStore(state => state.addNotification);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/notifications/stream`,
      { withCredentials: true }
    );

    eventSource.onmessage = (event) => {
      try {
        const notification = JSON.parse(event.data);
        addNotification(notification);
      } catch (error) {
        console.error('Error parsing notification:', error);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => eventSource.close();
  }, [addNotification]);
};
