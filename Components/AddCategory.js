import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import colors from '../Styles/colors';
import Text from './Text';

const AddCategory = ({ onCategoryAdded }) => {
  const [categoryName, setCategoryName] = useState('');
  const [expanded, setExpanded] = useState(false);

  const handlePress = () => {
    if (expanded && categoryName.trim()) {
      onCategoryAdded(categoryName.trim());
      setCategoryName('');
    }
    setExpanded(!expanded);
  };

  return (
    <View style={{ rowGap: 10 }}>
      {expanded && (
        <TextInput
          placeholder="Category Name"
          placeholderTextColor={colors.gray}
          value={categoryName}
          onChangeText={setCategoryName}
          style={styles.input}
        />
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
      >
        <Text style={styles.buttonText}>
          {expanded ? 'Done' : 'Add Category'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderBottomColor: colors.lightgray,
    borderBottomWidth: 1,
    padding: 10,
    paddingHorizontal: 5,
    marginHorizontal: 5,
    height: 30,
    outlineStyle: 'none',
  },
  button: {
    backgroundColor: colors.purple,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Montserrat',
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddCategory;
