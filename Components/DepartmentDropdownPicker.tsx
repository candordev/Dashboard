import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const DepartmentDropdownPicker = ({ items, selectedItems, setSelectedItems, adjustHeight }) => {
  const [open, setOpen] = useState<boolean>(false);

  // Adjust parent height based on the dropdown's open state
  const toggleDropdown = (isOpen: boolean) => {
    setOpen(isOpen);
    // Call adjustHeight with true when opened, false when closed
    adjustHeight(isOpen);
  };

  return (
    <View style={styles.container}>
      <DropDownPicker
        open={open}
        value={selectedItems}
        items={items}
        setOpen={toggleDropdown}
        setValue={setSelectedItems}
        multiple={true}
        listMode="SCROLLVIEW"
        dropDownContainerStyle={styles.dropDownContainerStyle}
        zIndex={1000} // Ensure dropdown is displayed above other components
        zIndexInverse={1000}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Container style if needed
  },
  dropDownContainerStyle: {
    // Adjust styles if needed
    maxHeight: 200, // Set a max height if you want to limit the dropdown's size
  },
});

export default DepartmentDropdownPicker;
