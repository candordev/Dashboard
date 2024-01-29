import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Notification} from "../utils/interfaces";
import { useUserContext } from '../Hooks/useUserContext';
import io from 'socket.io-client';



interface NotificationContextType {
    notifications: Notification[];
    addNotification: (notification: Notification) => void;
    removeNotification: (notificationId: string) => void; // Add this line
  }
  

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {}

});

export const useNotification = () => useContext(NotificationContext);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const { state, dispatch } = useUserContext();
    const userId = state._id; // The logged-in user's ID
    
    // Initialize WebSocket connection here
    useEffect(() => {
        const socket = io("https://candoradmin.com", {
            withCredentials: false,
            query: {
                userId
            }
        });

        socket.on('connect', () => {
            console.log('Connected to Socket.io server for user:', userId);
        });

        socket.on('new-notification', (notification) => {
            console.log("NEW NOTIF DETECTED!!!")
            addNotification(notification);
        });

        socket.on('disconnect', () => {
            console.log('Socket.io connection disconnected');
        });

        return () => {
            socket.disconnect();
        };
    }, [userId]);
  
    const addNotification = (notification: Notification) => {
      setNotifications((prevNotifications) => [...prevNotifications, notification]);
    };

    const removeNotification = (notificationId: string) => {
        setNotifications((prevNotifications) =>
          prevNotifications.filter((notif) => notif._id !== notificationId)
        );
      };
  
      return (
        <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
          {children}
        </NotificationContext.Provider>
      );
    };