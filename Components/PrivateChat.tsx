import React, { useState } from "react";
import { View } from "react-native";
import colors from "../Styles/colors";
import ExpandableTextInput from "./ExpandableTextInput";
import Text from "./Text";

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
      <ExpandableTextInput onInputChange={() => {}} onSubmit={() => {}} />
    </View>
  );
};

export default PrivateChat;
