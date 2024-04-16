import { Platform, StyleSheet } from "react-native";
import colors from "./colors";

const styles = StyleSheet.create({
  bigButton: {
    backgroundColor: colors.black,
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  bigButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  purpleGeneralContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: colors.purple,
    paddingBottom: 100,
  },

  offsetPicture: {
    position: "absolute",
    height: 19,
    width: 19,
    borderRadius: 20,
    overflow: "hidden",
    top: 21,
    left: 21,
  },

  headerIcon: {
    height: 25,
    width: 25,
    borderRadius: 15,
    overflow: "hidden",
  },

  profilePicture: {
    height: 35,
    width: 35,
    borderRadius: 20,
    overflow: "hidden",
  },

  leaderPicture: {
    height: 40,
    width: 40,
    borderRadius: 20,
    overflow: "hidden",
  },

  groupPicture: {
    height: 50,
    width: 50,
    borderRadius: 25,
    overflow: "hidden",
  },

  notificationPicture: {
    height: 37,
    width: 37,
    borderRadius: 25,
    overflow: "hidden",
  },

  profilePictureProfile: {
    height: 60,
    width: 60,
    borderRadius: 40,
    overflow: "hidden",
  },
  profilePictureEditProfile: {
    height: 90,
    width: 90,
    borderRadius: 45,
    overflow: "hidden",
  },

  button: {
    backgroundColor: colors.lightestgray,
    borderRadius: 7,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  text: {
    color: colors.black,
    fontFamily: "OpenSans-Regular",
  },
  inputContainer: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 16,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.black,
    padding: 12,
    outlineStyle: "none",
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 15,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 5,
    marginTop: 10,
    marginHorizontal: 10,
  },
  seenNotifCard: {
    backgroundColor: colors.white,
    borderColor: colors.lightestgray,
    borderBottomWidth: 3,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  textInput: {
    borderColor: colors.lightergray,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 7,
    backgroundColor: colors.white,
    outlineStyle: "none",
    fontFamily: "OpenSans",
    fontWeight: "450" as any,
  },
  outerBox: {
    margin: 20,
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.lightergray,
    flex: 1,
    justifyContent: 'center',
  },
  groupSettingsContainer: {
    margin: 10,
    padding: 15,
    borderRadius: 20,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    flex: 1
  },
});

export default styles;
