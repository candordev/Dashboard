import React, { useEffect, useState } from 'react';
import { useNotification } from "../Structure/NotificationContext";
import { Notification } from "../utils/interfaces";
import colors from '../Styles/colors';
import { useNavigation } from '@react-navigation/native';



type LaunchcreenProps = {
    navigation: any;
  };
  
function NotificationPopup({ navigation}: LaunchcreenProps): JSX.Element {

// const NotificationPopup = ({navigation}) => {
  const { notifications } = useNotification();
  const [showPopup, setShowPopup] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);

  useEffect(() => {
    if (notifications.length > 0) {
      setCurrentNotification(notifications[notifications.length - 1]);
      setShowPopup(true);

      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notifications]);

  if (!showPopup || !currentNotification) return null;

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
    fontWeight: 500
  };

  const handlePopupClick = () => {
    if (currentNotification) {
      console.log("CLIKCED!")
      navigation.navigate('inbox', { selectedNotification: currentNotification });
      setShowPopup(false);
    }
  };

  return (
    <div className="notification-popup" style={popupStyle} onClick={handlePopupClick}>
      New notification: {currentNotification.title}
      {/* Add additional notification details here */}
    </div>
  );
};

export default NotificationPopup;
