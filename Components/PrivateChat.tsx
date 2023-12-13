import React, { useState } from "react";
import { View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import FeatherIcon from "react-native-vector-icons/Feather";
import colors from "../Styles/colors";
import AutoAssign from "./AutoAssign";
import Text from "./Text";
import ExpandableTextInput from "./ExpandableTextInput";

const PrivateChat = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("transportation");
  const [items, setItems] = useState([
    { label: "Transportation", value: "transportation" },
    { label: "Education", value: "education" },
    { label: "Agriculture", value: "agriculture" },
  ]);

  return (
    <View
      style={{
        borderColor: colors.lightestgray,
        borderWidth: 2,
        borderRadius: 10,
        padding: 10,
        flex: 1,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "550",
          fontFamily: "Montserrat",
        }}
      >
        Private Chat
      </Text>
      <View style={{ flex: 1 }}></View>
      <ExpandableTextInput
        onInputChange={() => {}}
        onSubmit={() => {}}
        placeholder="Type a message..."
      />
    </View>
  );
};

export default PrivateChat;
