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
  styles?: any;
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
        // borderColor: colors.lightergray,
        // borderWidth: 2,
        borderWidth: 0,
        borderRadius: 15,
        backgroundColor: colors.white,
        minHeight: 37,
        ...props.styles?.dropdownStyle,
      }}
      placeholder={props.placeholder}
      placeholderStyle={{ color: colors.gray }}
      textStyle={{
        fontSize: 15,
        color: colors.black,
        fontFamily: "OpenSans",
        fontWeight: '500' as any,
        paddingLeft: 5,
        ...props.styles?.textStyle, // Apply custom text styles here
      }}
      listMode="SCROLLVIEW"
      dropDownContainerStyle={[
        {
          borderWidth: 0,
          borderTopWidth: 1,
          backgroundColor: colors.white,
          borderColor: colors.lightergray,
          borderRadius: 15,
          ...props.styles?.dropDownContainerStyle, // Apply custom dropdown container styles here
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
