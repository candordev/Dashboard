import React from "react";
import { View, Image } from "react-native";
import Text from "./Text";

const ProfileRow = (props : {name : string, profilePicture: string}) => {

  return (
    <View
      style={{
        flexDirection: "row",
        marginTop: 12,
        alignItems: 'center',
      }}
    >
      <Image
        source={{ uri: props.profilePicture }}
        style={{ height: 30, width: 30, borderRadius: 20, overflow: "hidden" }}
      />
      <Text style={{ fontSize: 16, marginLeft: 10, fontWeight: "500"}}>{props.name}</Text>
    </View>
  );
};

export default ProfileRow;
