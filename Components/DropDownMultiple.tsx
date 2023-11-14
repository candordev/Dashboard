import React, { useState } from "react";
import { View } from "react-native";
import colors from "../Styles/colors";
import DropDownPicker from "react-native-dropdown-picker";
import FeatherIcon from "react-native-vector-icons/Feather";

const DropDownMultiple = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string[]>([]);
  const [items, setItems] = useState([
    { label: "Transportation", value: "a" },
    { label: "Agriculture", value: "b" },
    { label: "Rural Development", value: "c" },
    { label: "Safety", value: "d" },
  ]);

  return (
    <DropDownPicker
      maxHeight={165}
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
        minHeight: 36,
      }}
      placeholder="Select category"
      placeholderStyle={{ color: colors.black }}
      textStyle={{
        fontSize: 15,
        color: colors.black,
        fontFamily: "OpenSans",
      }}
      listMode="SCROLLVIEW"
      dropDownContainerStyle={[
        {
          borderTopWidth: 1,
          backgroundColor: colors.white,
          borderColor: colors.lightgray,
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
  );
};

export default DropDownMultiple;
