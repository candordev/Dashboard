import { useHeaderHeight } from '@react-navigation/elements';
import React, { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

type KeyboardAvoidingViewBetterProps = PropsWithChildren<{
    style?: any;
    keyboardVerticalOffset?: number;
}>;

const KeyboardAvoidingViewBetter = ({children, ...props}: KeyboardAvoidingViewBetterProps) => {
  const height = useHeaderHeight();
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={height + (props.keyboardVerticalOffset || 0)}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[props.style]}
      enabled>
      {children}
    </KeyboardAvoidingView>
  );
};

export default KeyboardAvoidingViewBetter;
