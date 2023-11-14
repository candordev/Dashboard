import React, { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import FeatherIcon from "react-native-vector-icons/Feather";
import colors from "../Styles/colors";

type PropTypes = {
  placeholder: string;
  value: any;
  setValue: any;
  items: any;
  setItems: any;
  multiple: boolean;
};

const DropDown = (props: PropTypes) => {
  const [open, setOpen] = useState(false);

  return (
    <DropDownPicker
      maxHeight={165}
      open={open}
      multiple={props.multiple}
      value={props.value}
      items={props.items}
      setOpen={setOpen}
      setValue={props.setValue}
      setItems={props.setItems}
      dropDownDirection="BOTTOM"
      style={{
        borderColor: colors.lightergray,
        borderWidth: 2,
        backgroundColor: colors.white,
        minHeight: 36,
      }}
      placeholder={props.placeholder}
      placeholderStyle={{ color: colors.black }}
      textStyle={{
        fontSize: 15,
        color: colors.black,
        fontFamily: "OpenSans",
      }}
      listMode="SCROLLVIEW"
      dropDownContainerStyle={[
        {
          borderWidth: 2,
          borderTopWidth: 1,
          backgroundColor: colors.white,
          borderColor: colors.lightergray,
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

export default DropDown;
