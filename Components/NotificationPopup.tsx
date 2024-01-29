import React, { useEffect, useState } from 'react';
import { useNotification } from "../Structure/NotificationContext";
import { Notification } from "../utils/interfaces";
import colors from '../Styles/colors';
import { useNavigation } from '@react-navigation/native';



type LaunchcreenProps = {
    navigation: any;
  };
  
  function NotificationPopup({ navigation }: LaunchcreenProps): JSX.Element | null {
    const { notifications, removeNotification} = useNotification();
    const [showPopup, setShowPopup] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  
    useEffect(() => {
      if (notifications.length > 0) {
        setCurrentNotification(notifications[notifications.length - 1]);
        setShowPopup(true);
      }
    }, [notifications]);
  
    if (!showPopup || !currentNotification) return null;
  
    const handleCloseClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentNotification && currentNotification._id) {
          removeNotification(currentNotification._id); // Remove notification from global state
        }
        setHovered(false);
        setShowPopup(false);
      };
  
    const popupStyle: React.CSSProperties = {
      position: 'fixed',
      top: '30px',
      right: '20px',
      backgroundColor: colors.purple,
      color: 'white',
      border: '1px solid #ddd',
      padding: '11px',
      borderRadius: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      zIndex: 1000,
      fontFamily: 'Montserrat',
      fontWeight: 500,

    };
  
    const closeButtonStyle: React.CSSProperties = {
      position: 'absolute',
      top: '-7px',
      left: '-2px',
      border: 'none',
      background: colors.white,
      color: colors.purple,
      cursor: 'pointer',
      fontSize: '12px',
      borderColor: colors.lightgray,
      borderRadius: '50%', // Circular shape
      width: '22px', // Size of the button
      height: '22px', // Size of the button
      alignItems: 'center',
      justifyContent: 'center',
      display: hovered ? 'flex' : 'none', // Show only when hovered
    };
  
    const handlePopupClick = () => {
      if (currentNotification) {
        console.log("CLICKED!")
        navigation.navigate('inbox', { selectedNotification: currentNotification });
        setShowPopup(false);
      }
    };
  
    return (
      <div 
        className="notification-popup" 
        style={popupStyle} 
        onClick={handlePopupClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <button 
          style={closeButtonStyle} 
          onClick={handleCloseClick}
        >
          X
        </button>
        New notification: {currentNotification.title}
        {/* Add additional notification details here */}
      </div>
    );
  };
  
  export default NotificationPopup;
  
  
  
