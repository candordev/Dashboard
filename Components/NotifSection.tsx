import React, {useEffect, useState} from 'react';
import {Pressable, TouchableOpacity, View, useWindowDimensions, Text } from 'react-native';
import colors from '../Styles/colors';
import styles from '../Styles/styles';
import {Endpoints} from '../utils/Endpoints';
import {Notification, NotificationData, NotificationType, Post} from '../utils/interfaces';
import {customFetch} from '../utils/utils';
import {event, eventNames} from '../Events';
import NotifPicture from '../Screens/NotifPicture';
import IssueView from './IssueView';
import Popover, { PopoverPlacement } from 'react-native-popover-view';

type Props = {
  notif: Notification;
  navigation: any;
  onPopoverCloseComplete: () => void; // Add this line
};

function imageURL(contentType: NotificationType) {
  switch (contentType) {
    case NotificationType.commentLike:
      return 'Like';
    case NotificationType.newComment:
      return 'Comment';
    case NotificationType.updatePost:
      return 'Update';
    case NotificationType.upvote:
      return 'Like';
    case NotificationType.announcement:
      return 'Announcement';
    case NotificationType.pollVote:
      return 'PollVote';
    case NotificationType.proposalAccepted:
      return 'Accept';
    case NotificationType.proposalUnaccepted:
      return 'Bell';
    case NotificationType.proposal:
      return 'Proposal';
    default:
      return 'Bell';
  }
}

const fetchPost = async (postId: string | undefined) => {
  try {
    if(postId){
    let res: Response = await customFetch(
      Endpoints.getPostById +
        new URLSearchParams({
          postID: postId,
        }),
      {
        method: 'GET',
      },
    );
    let resJson = await res.json();
    if (!res.ok) {
     
    }
    if (res.ok) {
      const result: Post = resJson;
      // console.info("fetched post is ", result);
      return result
    }
  }
  } catch (error) {
   
  }
};

export const clickNotif = async (
  notifData: NotificationData | undefined,
  notifID: string,
  navigation: any,
) => {
  console.debug('Clicked notification:', notifData, notifID);
  try {
    let res: Response = await customFetch(Endpoints.seenNotification, {
      method: 'POST',
      body: JSON.stringify({
        notificationID: notifID,
      }),
    });
    // console.info(res);
    let resJson = await res.json();
    if (!res.ok) {
      throw new Error(resJson.error);
    }
    if (res.ok) {
      event.emit(eventNames.FETCH_NOTIFS);
      // console.log('Marked notification as seen');
    }
  } catch (error) {
    console.error('Error marking notification as seen: ', error);
  }

  switch (notifData?.contentType) {
    case NotificationType.commentLike:
      navigation.push('post', {
        postID: notifData?.postID,
        commentID: notifData?.commentID,
      });
      break;
    case NotificationType.newComment:
      navigation.push('post', {
        postID: notifData?.postID,
        commentID: notifData?.commentID,
      });
      break;
    case NotificationType.updatePost:
      // TODO
      break;
    case NotificationType.upvote:
      navigation.push('post', {
        postID: notifData?.postID,
      });
      break;
    case NotificationType.announcement:
      navigation.push('post', {
        postID: notifData?.postID,
      });
      break;
    case NotificationType.pollVote:
      navigation.push('post', {
        postID: notifData?.pollID,
      });
      break;
    case NotificationType.proposalAccepted:
      navigation.push('post', {
        postID: notifData?.postID,
      });
      break;
    case NotificationType.proposalUnaccepted:
      navigation.push('post', {
        postID: notifData?.postID,
      });
      break;
    case NotificationType.proposal:
      navigation.push('post', {
        postID: notifData?.postID,
      });
      break;
    default:
      console.error('Unknown notification type:', notifData);
      navigation.navigate('Notifications');
      break;
  }
};

const NotifSection = (props: Props) => {
  const [notif, setNotif] = useState<Notification>(props.notif);
  const [selectedPost, setSelectedPost] = useState<Post | null>();
  const [popoverVisible, setPopoverVisible] = useState(false);


  useEffect(() => {
    if (props.notif.data?.contentType !== NotificationType.reminder) {
      const fetchAndSetPost = async () => {
        try {
          const post = await fetchPost(props.notif.data?.postID);
          setSelectedPost(post);
        } catch (error) {
          console.error('Error fetching post:', error);
        }
      };
      fetchAndSetPost();
    }
  }, [props.notif.data]);


  useEffect(() => {
    setNotif(props.notif);
  }, [props.notif]);

  // const fetchNotif = async () => {
  //   // console.log("fetching notif");
  //   try {
  //     let res: Response = await customFetch(
  //       Endpoints.getNotification +
  //         new URLSearchParams({
  //           notificationID: notif._id,
  //         }),
  //       {
  //         method: 'GET',
  //       },
  //     );
  //     let resJson = await res.json();
  //     if (!res.ok) {

  //     }
  //     if (res.ok) {
  //       const result: Notification = resJson.notification;
  //       setNotif(notif => result);
  //       // console.log("notif: ", result);
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //     if (error instanceof Error) {
         
  //     } else {
         
  //     }
  // }
  
  // };

  const handleNotificationClick = async () => {
    try {
      let res: Response = await customFetch(Endpoints.seenNotification, {
        method: 'POST',
        body: JSON.stringify({ notificationID: notif._id }),
      });
      let resJson = await res.json();
      if (!res.ok) {
        throw new Error(resJson.error);
      }
      event.emit(eventNames.FETCH_NOTIFS);
      console.log("POST REQUEST HAPPENED")
    } catch (error) {
      console.error('Error marking notification as seen: ', error);
      throw error;
    }
  };

  const { height, width } = useWindowDimensions();
  
  return (
    <Popover
    onCloseComplete={props.onPopoverCloseComplete}
    onOpenStart={handleNotificationClick}
    from={(
      <TouchableOpacity style={[styles.seenNotifCard, notif.seen ? {} : {backgroundColor: colors.purple0}]}>
      <NotifPicture
          smallUrl={imageURL(notif.data?.contentType)}
          mainUrl={notif.picture}
          type={'big'}
        />
        <View style={{flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              paddingRight: 5,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={[
                styles.sectionTitle,
                {marginTop: 0, flex: -1, fontSize: 16, fontWeight: '600'},
              ]}
              numberOfLines={1}>
              {notif.title}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: colors.gray,
                flexWrap: 'nowrap',
                textAlign: 'left',
              }}>
            </Text>
          </View>
          <Text
            style={[styles.sectionDescription, {flex: 1}]}
            numberOfLines={2}>
            {notif.content}
          </Text>
        </View>
      </TouchableOpacity>
       )}
       placement={PopoverPlacement.FLOATING}
       popoverStyle={{
         borderRadius: 10,
         width: width * 0.7,
         height: height * 0.9,
       }}
      >
      {props.notif.data?.contentType === NotificationType.reminder ?
        (
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 15 }}>{props.notif.title}</Text>
            <Text style={{ fontSize: 16 }}>{props.notif.content}</Text>
          </View>
        ) :
        selectedPost && <IssueView issue={selectedPost} />
      }
    </Popover>
    );
  };
  
  // return (
  //   <Pressable
  //     onPress={async () => {
  //       await clickNotif(notif.data, notif._id, props.navigation);
  //       fetchNotif();
  //     }}>
  //     <View style={[styles.notifCard]}>
  //       {/* <View style={{height: 10, width: 10, borderRadius: 5, backgroundColor: !notif.seen ? colors.purple : colors.white}}/> */}
  //       <View style={{flexDirection: 'column'}}>
  //         <NotifPicture
  //           smallUrl={imageURL(notif.data?.contentType)}
  //           mainUrl={notif.picture}
  //           type={'big'}
  //         />
  //       </View>
  //       <View style={{flex: 1}}>
  //         <View
  //           style={{
  //             flexDirection: 'row',
  //             paddingRight: 5,
  //             justifyContent: 'space-between',
  //             alignItems: 'center',
  //           }}>
  //           <Text
  //             style={[styles.sectionTitle, {marginTop: 0, flex: -1}]}
  //             numberOfLines={1}>
  //             {notif.title}
  //           </Text>
  //           <Text
  //             style={{
  //               fontSize: 13,
  //               color: colors.gray,
  //               flexWrap: 'nowrap',
  //               textAlign: 'left',
  //             }}>
  //             {formatTime(notif.fireDate)}
  //           </Text>
  //         </View>
  //         <Text
  //           style={[styles.sectionDescription, {flex: 1}]}
  //           numberOfLines={2}>
  //           {notif.content}
  //         </Text>
  //       </View>
  //     </View>
  //   </Pressable>
  // );


export default NotifSection;
function setLoading(arg0: boolean) {
  throw new Error('Function not implemented.');
}

