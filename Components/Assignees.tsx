import React, { useState } from "react";
import { View } from "react-native";
import colors from "../Styles/colors";
import Text from "./Text";
import ProfileRow from "./ProfileRow";
import DropDownPicker from "react-native-dropdown-picker";
import FeatherIcon from "react-native-vector-icons/Feather";

const Assignees = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([]);
  const [items, setItems] = useState([
    { label: "Tanuj Dunthuluri", value: "Tanuj Dunthuluri" },
    { label: "Atishay Jain", value: "Atishay Jain" },
    { label: "Rishi Bengani", value: "Rishi Bengani" },
  ]);
  return (
    <View
      style={{
        borderColor: colors.lightestgray,
        borderWidth: 2,
        borderRadius: 10,
        padding: 10,
        minHeight: open ? 210 : undefined,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "550",
          fontFamily: "Montserrat",
        }}
      >
        Assignees
      </Text>
      <DropDownPicker
        multiple={true}
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        dropDownDirection="BOTTOM"
        style={{
          borderColor: colors.lightgray,
          borderWidth: 1,
          backgroundColor: colors.white,
          marginTop: 10,
          minHeight: 30,
        }}
        placeholder="Select Assignees"
        textStyle={{
          fontSize: 15,
          color: colors.black,
          fontWeight: "500",
          fontFamily: "Montserrat",
        }}
        listMode="SCROLLVIEW"
        dropDownContainerStyle={[
          {
            borderTopWidth: 1,
            backgroundColor: colors.white,
            borderColor: colors.lightgray,
            marginTop: 10,
          },
        ]}
        ArrowDownIconComponent={() => (
          <FeatherIcon name={"chevron-down"} size={20} color={colors.gray} />
        )}
        ArrowUpIconComponent={() => (
          <FeatherIcon name={"chevron-up"} size={20} color={colors.gray} />
        )}
        TickIconComponent={() => (
          <FeatherIcon name={"check"} size={17} color={colors.gray} />
        )}
      />
      {value.map((item, index) => {
        return <ProfileRow name={item} key={index} />;
      })}
    </View>
  );
};

export default Assignees;
