import React from "react";
import { View, Image } from "react-native";
import Text from "./Text";

const ProfileRow = (props : {name : string}) => {
  const imageUrl = "https://avatars.githubusercontent.com/u/100013";

  return (
    <View
      style={{
        flexDirection: "row",
        marginTop: 10,
        alignItems: 'center',
      }}
    >
      <Image
        source={{ uri: imageUrl }}
        style={{ height: 23, width: 23, borderRadius: 20, overflow: "hidden" }}
      />
      <Text style={{ fontSize: 16, marginLeft: 10, fontWeight: "500"}}>{props.name}</Text>
    </View>
  );
};

export default ProfileRow;
