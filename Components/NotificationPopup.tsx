import React, { useEffect, useState } from 'react';
import { useNotification } from "../Structure/NotificationContext";
import { Notification, NotificationType } from "../utils/interfaces";
import colors from '../Styles/colors';
import { useNavigation } from '@react-navigation/native';
import NotifPicture from '../Screens/NotifPicture';

type LaunchcreenProps = {
    navigation: any;
};

function NotificationPopup({ navigation }: LaunchcreenProps): JSX.Element | null {
    const { notifications, removeNotification } = useNotification();
    const [showPopup, setShowPopup] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);

    useEffect(() => {
        if (notifications.length > 0) {
            setCurrentNotification(notifications[notifications.length - 1]);
            setShowPopup(true);
        } else {
            setCurrentNotification(null);
            setShowPopup(false);
        }
    }, [notifications]);

    if (!showPopup || !currentNotification) return null;

    const handleCloseClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentNotification && currentNotification._id) {
            await removeNotification(currentNotification._id);
        }
        setHovered(false);
        setShowPopup(false);
    };

  
    const popupStyle: React.CSSProperties = {
      position: 'fixed',
      top: '30px',
      right: '20px',
      backgroundColor: colors.lightestgray,
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
      color: colors.gray,
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
        
        console.log("CLICKED!", currentNotification)
        navigation.navigate('inbox', { selectedNotification: currentNotification });
        setShowPopup(false);
      }
    };


function imageURL(contentType: NotificationType) {
    switch (contentType) {
      case NotificationType.commentLike:
        return "Like";
      case NotificationType.newComment:
        return "Comment";
      case NotificationType.updatePost:
        return "Update";
      case NotificationType.upvote:
        return "Like";
      case NotificationType.announcement:
        return "Announcement";
      case NotificationType.pollVote:
        return "PollVote";
      case NotificationType.proposalAccepted:
        return "Accept";
      case NotificationType.proposalUnaccepted:
        return "Bell";
      case NotificationType.proposal:
        return "Proposal";
      default:
        return "Bell";
    }
  }
  
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
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <NotifPicture
          smallUrl={imageURL(currentNotification.data?.contentType)}
          mainUrl={currentNotification.picture}
          type={"big"} 
        />
        <div style={{ padding: 0, flex: 1, marginLeft: 10 }}> {/* Increased margin here */}
          <div style={{ fontWeight: "600", fontSize: 13.5, marginBottom: 3 ,color: colors.black}}>
            {currentNotification.title}
          </div>
          <div style={{ fontSize: 11.5, color: colors.black, wordWrap: 'break-word', whiteSpace: 'normal',  maxWidth: '300px'}}>
            {currentNotification.content}
          </div>
        </div>
      </div>
    </div>
  );
  
  
  };
  
  
  export default NotificationPopup;
  
  
  
