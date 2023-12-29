import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import colors from "../Styles/colors";
import Popover, { PopoverPlacement } from "react-native-popover-view";

// Define a type for the props
interface OptionPickerProps {
  onOptionChange: (option: string) => void;
}

const OptionPicker = ({ onOptionChange }: OptionPickerProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>("Tag");
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    onOptionChange(option);
    setIsPopoverVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontFamily: "Montserrat",
          fontSize: 16,
          marginRight: 7,
          fontWeight: "500",
        }}
      >
        Separate By:
      </Text>
      <Popover
        from={
          <TouchableOpacity
            onPress={() => setIsPopoverVisible(true)}
            style={{
              backgroundColor: colors.lightergray,
              borderRadius: 15,
              paddingHorizontal: 10,
              paddingVertical: 7,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontWeight: "550" as any,
                color: colors.black,
                fontFamily: "Montserrat",
                fontSize: 15,
              }}
            >
              {selectedOption}
            </Text>
          </TouchableOpacity>
        }
        placement={PopoverPlacement.BOTTOM}
        popoverStyle={{
          borderRadius: 10,
        }}
        arrowSize={{ height: 0, width: 0 }}
        offset={10}
        isVisible={isPopoverVisible}
        onRequestClose={() => setIsPopoverVisible(false)}
      >
        <View>
          {["Deadline", "Location", "Department", "Tag"].map((option) => (
            <Pressable
              key={option}
              style={{
                borderBottomColor: colors.lightgray,
                padding: 10,
                backgroundColor:
                  selectedOption === option ? colors.black : colors.white,
              }}
              onPress={() => handleSelect(option)}
            >
              <Text
                style={[
                  styles.text,
                  {
                    color:
                      selectedOption === option ? colors.white : colors.black,
                  },
                ]}
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
      </Popover>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    borderRadius: 15,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  text: {
    fontWeight: "500",
    fontSize: 15,
    fontFamily: "Montserrat",
  },
});

export default OptionPicker;
