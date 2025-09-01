import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser && currentUser.userid) {

      const socketUrl = process.env.NODE_ENV === 'production'
      ? window.location.origin // Connect to same domain in production
      : import.meta.env.VITE_BACKEND_URL;

      // Initialize socket connection
      const newSocket = io(socketUrl, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      newSocket.on('connect', () => {
        setIsConnected(true);
        setConnectionAttempts(0);

        // Join user to their personal room
        newSocket.emit('join_user', currentUser.userid);
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        setIsConnected(false);
        setConnectionAttempts(prev => prev + 1);
      });

      newSocket.on('reconnect', (attemptNumber) => {
        setIsConnected(true);
        // Re-join user room after reconnection
        newSocket.emit('join_user', currentUser.userid);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [currentUser]);

  const value = {
    socket,
    isConnected,
    connectionAttempts
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};