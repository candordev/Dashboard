import React from 'react';
import { View } from 'react-native';
import colors from '../../Styles/colors';
import Text from '../Text';

type Props = {
  error: string;
  style?: any;
};

const ErrorMessage = (props: Props) => {
  if (!props.error) return null;

  return (
    <View>
      {props.error.trim() != '' && (
        <Text style={[{color: colors.red, fontSize: 15, textAlign: 'center'}, props.style]}>
          {props.error.trim()}
        </Text>
      )}
    </View>
  );
};

export default ErrorMessage;
