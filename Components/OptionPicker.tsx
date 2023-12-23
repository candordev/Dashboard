import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from "../Styles/colors";

// Define a type for the props
interface OptionPickerProps {
  onOptionChange: (option: string) => void;
}

const OptionPicker = ({ onOptionChange }: OptionPickerProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>('Tag');

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    onOptionChange(option);
  };

  return (
    <View style={styles.container}>
      {['Deadline', 'Location', 'Department', 'Tag'].map((option) => (
        <TouchableOpacity
          key={option}
          style={[styles.button, { backgroundColor: selectedOption === option ? colors.black : colors.lightergray }]}
          onPress={() => handleSelect(option)}
        >
          <Text style={[styles.text, { color: selectedOption === option ? colors.white : colors.black }]}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 10,
    marginTop: -7,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  button: {
    borderRadius: 15,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  text: {
    fontWeight: '500',
  },
});

export default OptionPicker;
