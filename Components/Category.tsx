import React, { useState } from "react";
import { View } from "react-native";
import colors from "../Styles/colors";
import Text from "./Text";
import ProfileRow from "./ProfileRow";
import DropDownPicker from "react-native-dropdown-picker";
import FeatherIcon from "react-native-vector-icons/Feather";

const Category = () => {
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
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "550",
          fontFamily: "Montserrat",
        }}
      >
        Category
      </Text>
      <DropDownPicker
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
    </View>
  );
};

export default Category;
