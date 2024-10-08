import React, { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import FeatherIcon from "react-native-vector-icons/Feather";
import colors from "../Styles/colors";

type DropDownDirectionType = 'AUTO' | 'TOP' | 'BOTTOM'; // Example, adjust based on actual type definition

type PropTypes = {
  placeholder: string;
  value: any;
  setValue: any;
  items: any;
  setItems: any;
  multiple: boolean;
  backgroundColor?: string;
  onClose?: () => void;
  styles?: any;
  multipleText?: string;
  dropDownDirection?: DropDownDirectionType;
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
      dropDownDirection={props.dropDownDirection || "BOTTOM"} // Default to "BOTTOM" if not provided
      style={{
        zIndex: 4,
        borderWidth: open ? 1 : 0,
        borderColor: colors.lightergray,
        borderRadius: 15,
        backgroundColor: props.backgroundColor ?? colors.white,
        minHeight: 37,
        ...props.styles?.dropdownStyle,
      }}
      onClose={props.onClose}
      placeholder={props.placeholder}
      placeholderStyle={{ color: colors.gray }}
      textStyle={{
        fontSize: 15,
        color: colors.black,
        fontFamily: "Montserrat",
        fontWeight: "500" as any,
        paddingLeft: 5,
        ...props.styles?.textStyle, // Apply custom text styles here
      }}
      listMode="SCROLLVIEW"
      dropDownContainerStyle={[
        {
          borderWidth: open ? 1 : 0,
          borderTopWidth: 1,
          backgroundColor: props.backgroundColor ?? colors.white,
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
      multipleText={props.multipleText}
    />
  );
};

export default DropDown;