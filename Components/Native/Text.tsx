import React, {forwardRef} from 'react';
import {Text as RNText} from 'react-native';
import styles from '../../Styles/styles';

type TextProps = {
  children: any;
  style: any;
};

const Text = forwardRef<TextProps, any>(({style, children, ...props}, ref) => {
  if (!style) {
    return (
      <RNText style={[styles.text, style]} ref={ref} {...props}>
        {children}
      </RNText>
    );
  }

  let mergedStyle : any = [styles.text, style];

  if (Array.isArray(mergedStyle)) {
    mergedStyle = flattenStyles(mergedStyle);
  }

  const {fontWeight, fontFamily} = mergedStyle;

  let font = 'OpenSans';
  if (fontFamily && fontFamily.split('-')[0].length > 0) {
    font = fontFamily.split('-')[0];
  }
  // if (!fontFamily) {
  //   font = 'OpenSans';
  // } else {
  //   font = fontFamily.split('-')[0];
  // }

  if (fontWeight === '300' || fontWeight === 300) {
    mergedStyle.fontFamily = font + '-Light';
  } else if (fontWeight === '400' || fontWeight === 400 || fontWeight === 'normal') {
    mergedStyle.fontFamily = font + '-Regular';
  } else if (fontWeight === '500' || fontWeight === 500) {
    mergedStyle.fontFamily = font + '-Medium';
  } else if (fontWeight === '600' || fontWeight === 600) {
    mergedStyle.fontFamily = font + '-SemiBold';
  } else if (fontWeight === '700' || fontWeight === 700 || fontWeight === 'bold') {
    mergedStyle.fontFamily = font + '-Bold';
  }

  delete mergedStyle['fontWeight'];

  return (
    <RNText style={mergedStyle} ref={ref} {...props}>
      {children}
    </RNText>
  );
});

function flattenStyles(styles: any) {
  return styles.reduce((result: any, currentStyle: any) => {
    if (Array.isArray(currentStyle)) {
      const flattened = flattenStyles(currentStyle);
      return {...result, ...flattened};
    } else {
      return {...result, ...currentStyle};
    }
  }, {});
}

Text.displayName = 'Text';

export default Text;
