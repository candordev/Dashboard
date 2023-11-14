import React from "react";
import { Pressable, View } from "react-native";
import colors from "../Styles/colors";
import Text from "./Text";

type ProgressBarProps = {
  step: number;
  navigation?: any;
  profilePost?: boolean;
};

function ProgressBar(props: ProgressBarProps): JSX.Element {
  let underText = "";
  if (props.step === 0) {
    underText = "No Progress";
  } else if (props.step === 1) {
    underText = "Assigned";
  } else if (props.step === 2) {
    underText = "In Progress";
  } else if (props.step === 3) {
    underText = "Completed";
  }
  return (
    <View style={{ alignItems: "center" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: 82,
        }}
      >
        <ProgressBlock filled={props.step >= 1} />
        <ProgressBlock filled={props.step >= 2} />
        <ProgressBlock filled={props.step >= 3} />
        {/* <ProgressBlock filled={true} />
        <ProgressBlock filled={true} />
        <ProgressBlock filled={props.step >= 3} /> */}
      </View>
      <Text
        style={{
          color: colors.black,
          fontSize: 13,
          fontWeight: "500",
          paddingBottom: 3,
          marginTop: 3,
        }}
      >
        {underText}
      </Text>
    </View>
  );
}

export function ProgressBlock({
  filled,
  scale = 1,
}: {
  filled: boolean;
  scale?: number;
}) {
  return (
    <View
      style={[
        {
          height: 9 * scale,
          width: 25 * scale,
          borderWidth: 1,
          borderColor: colors.black,
          borderRadius: 4 * scale,
        },
        filled ? { backgroundColor: colors.black } : {},
      ]}
    />
  );
}

export default ProgressBar;
