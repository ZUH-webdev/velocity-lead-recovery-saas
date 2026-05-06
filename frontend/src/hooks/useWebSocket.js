import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';

export const useWebSocket = (onLeadUpdate) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize Socket.io connection
    socketRef.current = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current.on('connect', () => {
      console.log('✅ WebSocket connected');
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
      setIsConnected(false);
    });

    socketRef.current.on('lead:updated', (data) => {
      console.log('📊 Lead update received:', data);
      if (onLeadUpdate) {
        onLeadUpdate(data);
      }
    });

    socketRef.current.on('lead:new', (data) => {
      console.log('🆕 New lead received:', data);
      if (onLeadUpdate) {
        onLeadUpdate({ ...data, isNew: true });
      }
    });

    socketRef.current.on('calendar:synced', (data) => {
      console.log('📅 Calendar synced:', data);
      window.dispatchEvent(
        new CustomEvent('calendar:synced', { detail: data })
      );
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [onLeadUpdate]);

  return {
    isConnected,
    socket: socketRef.current,
  };
};

export const useRealTimeCalendar = () => {
  const [lastSync, setLastSync] = useState(new Date());
  const [syncInProgress, setSyncInProgress] = useState(false);

  useEffect(() => {
    const handleSync = (event) => {
      setSyncInProgress(false);
      setLastSync(new Date(event.detail.timestamp));
    };

    window.addEventListener('calendar:synced', handleSync);
    return () => window.removeEventListener('calendar:synced', handleSync);
  }, []);

  return {
    lastSync,
    syncInProgress,
    setSyncInProgress,
  };
};
