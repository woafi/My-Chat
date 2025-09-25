import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

const NotificationContext = createContext();

export function useNotification() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { currentUser } = useAuth();
  const { socket, isConnected } = useSocket();

  // Fetch initial notifications when user changes
  useEffect(() => {
    if (currentUser && currentUser.userid) {
      fetchNotifications();
    }
  },);
  
  // Listen for login event to fetch notifications
  useEffect(() => {
    const handleUserLogin = () => {
      if (currentUser && currentUser.userid) {
        fetchNotifications();
      }
    };
    
    window.addEventListener('user-logged-in', handleUserLogin);
    
    return () => {
      window.removeEventListener('user-logged-in', handleUserLogin);
    };
  }, [currentUser]);

  // Listen for new messages via socket
  useEffect(() => {
    if (!socket || !isConnected || !currentUser) return;

    const handleNewMessage = (data) => {
      const { message } = data;
      // console.log(message);
      // Only add to notifications if the message is for the current user and not from them
      if (message.receiver.id === currentUser.userid && message.sender.id !== currentUser.userid && !message.seen) {
        setNotifications(prev => {
          // Check if notification already exists to avoid duplicates
          const exists = prev.some(n => n._id === message._id);
          if (exists) return prev;
          
          // Add new notification
          const newNotifications = [message, ...prev];
          updateUnreadCount(newNotifications);
          return newNotifications;
        });
      }
    };

    socket.on('new_message', handleNewMessage);

    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [socket, isConnected, currentUser]);

  // Fetch notifications from the server
  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/messages/unread');
      if (response.data && response.data.messages) {
        setNotifications(response.data.messages);
        updateUnreadCount(response.data.messages);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Update unread count
  const updateUnreadCount = (notificationsList) => {
    const count = notificationsList.filter(n => !n.seen).length;
    setUnreadCount(count);
  };

  // Mark a notification as read
  const markAsRead = async (messageId) => {
    try {
      await axios.patch(`/api/messages/${messageId}/seen`, { seen: true });
      
      setNotifications(prev => {
        const updated = prev.map(n => {
          if (n._id === messageId) {
            return { ...n, seen: true };
          }
          return n;
        });
        
        updateUnreadCount(updated);
        return updated;
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await axios.patch('/api/messages/mark-all-seen');
      
      setNotifications(prev => {
        const updated = prev.map(n => ({ ...n, seen: true }));
        updateUnreadCount(updated);
        return updated;
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Remove a notification
  const removeNotification = (messageId) => {
    setNotifications(prev => {
      const filtered = prev.filter(n => n._id !== messageId);
      updateUnreadCount(filtered);
      return filtered;
    });
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    fetchNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}