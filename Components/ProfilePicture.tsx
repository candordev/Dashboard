import React from 'react';
import { Image, Pressable, View } from 'react-native';
import styles from '../Styles/styles';
import Text from './Text';

type ProfilePictureProps = {
  imageUrl: string;
  type?: 'normal' | 'editProfile' | 'profile' | 'group' | 'headerIcon' | 'notification' | 'leader';
  style?: any;
  onPress?: any;
  underText?: string;
  textStyle?: any;
};

function ProfilePicture({
  imageUrl,
  style,
  onPress,
  underText,
  textStyle,
  type = 'normal',
}: ProfilePictureProps): JSX.Element {
  let profileStyle = {};
  switch (type) {
    case 'normal':
      profileStyle = styles.profilePicture;
      break;
    case 'editProfile':
      profileStyle = styles.profilePictureEditProfile;
      break;
    case 'profile':
      profileStyle = styles.profilePictureProfile;
      break;
    case 'group':
      profileStyle = styles.groupPicture;
      break;
    case 'headerIcon':
      profileStyle = styles.headerIcon;
      break;
    case 'notification':
      profileStyle = styles.notificationPicture;
      break;
    case 'leader':
      profileStyle = styles.leaderPicture;
  }

  if (!onPress) {
    return (
      <View style={[{alignItems: 'center'}, style]}>
        <Image source={{uri: imageUrl}} style={profileStyle} />
        {underText && (
          // <View style={{position: 'absolute', bottom:0, right: 0}}>
          //   <AntDesignIcon name="edit" size={40} color={colors.gray} />
          // </View>
          <Text
            style={textStyle}>
            {underText}
          </Text>
        )}
      </View>
    );
  }

  return (
    <Pressable onPress={onPress} style={[{alignItems: 'center'}, style]}>
      <Image source={{uri: imageUrl}} style={profileStyle} />
      {underText && (
        // <View style={{position: 'absolute', bottom:0, right: 0}}>
        //   <AntDesignIcon name="edit" size={40} color={colors.gray} />
        // </View>
        <Text
          style={textStyle}>
          {underText}
        </Text>
      )}
    </Pressable>
  );
}

export default ProfilePicture;
