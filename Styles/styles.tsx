import {Platform, StyleSheet} from 'react-native';
import colors from './colors';

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 4,
    paddingHorizontal: 15,
    backgroundColor: colors.white,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginTop: 10,
    // fontFamily: fonts.title,
    color: colors.black,
  },
  sectionDescription: {
    marginTop: 3,
    fontSize: 13,
    fontWeight: '400',
    color: colors.black,
    // fontFamily: fonts.body,
  },
  highlight: {
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  dropdownStyle: {
    borderColor: colors.lightgray,
    borderWidth: 1,
    color: colors.gray,
    minHeight: 30,
    backgroundColor: colors.white,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
  },

  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },

  offsetPicture: {
    position: 'absolute',
    height: 19,
    width: 19,
    borderRadius: 20,
    overflow: 'hidden',
    top: 21,
    left: 21,
  },

  offsetPictureBig: {
    position: 'absolute',
    height: 30,
    width: 30,
    borderRadius: 20,
    overflow: 'hidden',
    top: 25,
    left: 25,
  },

  headerIcon: {
    height: 25,
    width: 25,
    borderRadius: 15,
    overflow: 'hidden',
  },

  profilePicture: {
    height: 35,
    width: 35,
    borderRadius: 20,
    overflow: 'hidden',
  },

  leaderPicture: {
    height: 40,
    width: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },

  groupPicture: {
    height: 50,
    width: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },

  notificationPicture: {
    height: 37,
    width: 37,
    borderRadius: 25,
    overflow: 'hidden',
  },

  profilePictureProfile: {
    height: 80,
    width: 80,
    borderRadius: 40,
    overflow: 'hidden',
  },
  profilePictureEditProfile: {
    height: 100,
    width: 100,
    borderRadius: 50,
    overflow: 'hidden',
  },

  button: {
    backgroundColor: colors.lightestgray,
    borderRadius: 7,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  fakeDropdown: {
    backgroundColor: colors.lightestgray,
    borderRadius: 7,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  // headerButton: {
  //   backgroundColor: colors.white,
  //   borderColor: colors.gray,
  //   borderWidth: 1.5,
  //   borderRadius: 7,
  //   paddingVertical: 7,
  //   paddingHorizontal: 10,
  //   marginBottom: Platform.OS === 'ios' ? 10 : 0,
  // },
  commentContainer: {
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: colors.white,
    paddingTop: 5,
    marginTop: 4,
    paddingBottom: 5,
  },
  commentDescription: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '400',
    color: colors.black,
    // fontFamily: fonts.body,
  },
  replyContainer: {
    paddingLeft: 15,
    backgroundColor: colors.white,
    paddingTop: 5,
    borderLeftWidth: 1,
    borderLeftColor: colors.lightgray,
  },
  moreRepliesButton: {
    marginRight: 10,
    paddingTop: 5,
    borderLeftWidth: 1,
    borderLeftColor: colors.lightgray,
  },
  moreRepliesText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.purple,
    marginBottom: 10,
    marginRight: 10,
    marginLeft: 15,
  },
  text: {
    color: colors.black,
    fontFamily: 'OpenSans-Regular',
  },
  headerText: {
    color: colors.black,
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 16,
    // borderWidth: 1,
    // borderColor: colors.lightgray,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  bigButton: {
    borderRadius: 8,
    paddingVertical: 10,
    width: '100%',
    backgroundColor: colors.purple,
    alignItems: 'center',
    borderWidth: 0,
  },
  bigButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  smallButton: {
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: colors.purple,
    borderColor: colors.lightgray,
    alignItems: 'center',
    borderWidth: 0,
  },
  headerButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: colors.purple4,
  },
  nativeHeaderButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: colors.purple4,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.black,
    padding: 12,
  },
  charCount: {
    alignSelf: 'flex-end',
    color: colors.gray,
    marginRight: 20,
  },

  //Bottom Sheet Relates
  bottomSheet: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: colors.white,
  },
  bottomSheetContent: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  menuItem: {
    alignItems: 'center',
    paddingHorizontal: 29,
    paddingVertical: 13,
    backgroundColor: colors.white,
    //borderBottomWidth: 0.4,
    //borderBottomColor: colors.lightgray,
    width: '100%',
  },
  menuIcon: {
    position: 'absolute',
    left: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  //Other
  candorTitle: {
    fontSize: 70,
    fontWeight: '600',
    color: colors.white,
    fontFamily: 'Montserrat-SemiBold',
  },
  candorSubtitle: {
    fontSize: 30,
    fontWeight: '600',
    color: colors.white,
    fontFamily: 'Montserrat-SemiBold',
  },
  logo: {
    fontWeight: '600',
    color: colors.purple,
    fontFamily: 'Montserrat-SemiBold',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 15,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 5,
    marginTop: 10,
    marginHorizontal: 10,
  },
  leaderCard: {
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    // borderColor: colors.lightgray,
    // borderWidth: 0.5,
    padding: 5,
    paddingTop: 14,
    paddingBottom: 10,
    width: 140,
    marginTop: 2,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  topMembersCard: {
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    // borderColor: colors.lightgray,
    // borderWidth: 0.5,
    padding: 5,
    paddingTop: 10,
    paddingBottom: 10,
    // marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  notifCard: {
    backgroundColor: colors.purple0,
    // backgroundColor: colors.white,
    borderRadius: 10,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    padding: 10,
    marginVertical: 2.5,
    marginHorizontal: 5,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    columnGap: 10,
    // borderColor: colors.purple1,
    // borderWidth: 0.6,
  },
  seenNotifCard: {
    backgroundColor: colors.white,
    // opacity: 0.,
    borderRadius: 10,
    // shadowColor: colors.black,
    // shadowOffset: {width: 0, height: 1},
    // shadowOpacity: 0.2,
    // shadowRadius: 2,
    borderColor: colors.lightestgray,
    borderWidth: 1.5,
    padding: 30,
    // paddingHorizontal: 15,
    marginVertical: 2.5,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  settingsButton: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.purple4,
    marginTop: 16,
    marginBottom: 8,
  },
  dropShadow: {
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  tabBarLabel: {
    fontFamily: 'Montserrat',
    fontSize: 15,
    fontWeight: '500',
    textTransform: 'none',
  },
  socialButtonText: {
    fontSize: 17,
    color: colors.black,
    fontWeight: '600',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 10,
    backgroundColor: '#ffffff',
    height: 42,
    borderRadius: 8,
    width: '100%',
  },

  pollItem: {
    borderColor: colors.lightestgray,
    backgroundColor: colors.lightestgray,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    height: 35,
    overflow: 'hidden',
  },

  activeSlidingBar: {
    height: '100%',
    backgroundColor: colors.purple3,
  },

  inactiveSlidingBar: {
    height: '100%',
    backgroundColor: colors.purple1,
  },

  pollItemText: {
    fontSize: 15,
    color: colors.black,
    paddingLeft: 8,
    fontWeight: '600',
  },

  pollPercentText: {
    fontSize: 15,
    color: colors.black,
    marginRight: 20,
  },
  containerAkshat: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: colors.purple,
    paddingBottom: 100,
  },
  textInput: {
    borderColor: colors.lightgray,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: colors.white,
    outlineStyle: "none",
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default styles;
