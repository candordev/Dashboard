import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Popover, {PopoverPlacement} from "react-native-popover-view";
import FeatherIcon from "react-native-vector-icons/Feather";
import colors from "../Styles/colors";

const MoreButton = () => {
  return (
    <Popover
      from={<FeatherIcon name="more-vertical" size={20} color={colors.black} />}
      arrowSize={{ width: 0, height: 0 }}
      placement={PopoverPlacement.RIGHT}
      offset={20}
    >
      <View style={{padding: 10, width: 150, alignItems: 'center', rowGap: 10}}>
        <Text>Accept Issue</Text>
        <Text>Redirect Issue</Text>
        <Text>Report Issue</Text>
      </View>
    </Popover>
  );
};

export default MoreButton;
