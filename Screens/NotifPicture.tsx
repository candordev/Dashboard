import React from "react";
import { Image, View } from "react-native";
import styles from "../Styles/styles";

import ProfilePicture from "../Components/ProfilePicture";
import { images } from "../utils/images";

type Props = {
  mainUrl: string;
  smallUrl: string;
  style?: any;
  type: "big" | "small";
};

function NotifPicture({ smallUrl, ...props }: Props): JSX.Element {
  if (props.type === "big") {
    return (
      <View style={[props.style, { paddingRight: 3, flex: -1 }]}>
        <ProfilePicture imageUrl={props.mainUrl} type="notification" />
        <Image source={images[smallUrl].uri} style={styles.offsetPicture} />
      </View>
    );
  }

  return (
    <View style={[props.style, { paddingRight: 3, flex: -1 }]}>
      <Image
        source={{
          uri: props.mainUrl,
        }}
        style={{ height: 27, width: 27, borderRadius: 15, overflow: "hidden" }}
      />
      <Image
        source={images[smallUrl].uri}
        style={{
          position: "absolute",
          height: 15,
          width: 15,
          borderRadius: 20,
          overflow: "hidden",
          top: 15,
          left: 15,
        }}
      />
    </View>
  );
}

export default NotifPicture;
