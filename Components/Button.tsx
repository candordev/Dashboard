
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../Styles/colors';

interface ButtonProps {
  text: string;
  onPress: () => void;
  style?: any;
  textStyle?: any;
}

const Button: React.FC<ButtonProps> = ({ text, style, textStyle, onPress }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={[styles.buttonText, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.black,
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default Button;
