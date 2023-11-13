import React from 'react';
import { View } from 'react-native';
import colors from '../../Styles/colors';
import Text from '../Native/Text';

type Props = {
  error: string;
};

const ErrorMessage = (props: Props) => {
  return (
    <View>
      {props.error.trim() != '' && (
        <Text style={{color: colors.red, fontSize: 15, textAlign: 'center'}}>
          {props.error.trim()}
        </Text>
      )}
    </View>
  );
};

export default ErrorMessage;
