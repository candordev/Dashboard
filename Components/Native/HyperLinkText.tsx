import React, {PropsWithChildren} from 'react';
import {View} from 'react-native';
import colors from '../../Styles/colors';
import Text from '../Native/Text';
import Hyperlink from 'react-native-hyperlink';

type HyperLinkTextProps = PropsWithChildren<{
  style?: any;
  hyperLinkStyle?: any;
  numberOfLines?: number;
}>;

const HyperLinkText = ({
  children,
  style,
  hyperLinkStyle,
  numberOfLines = undefined,
}: HyperLinkTextProps) => {
  return (
    <Hyperlink
      linkDefault={true}
      linkStyle={[{color: colors.purple, fontWeight: '500', opacity: 1}, hyperLinkStyle]}>
      <Text style={style} numberOfLines={numberOfLines}>
        {children}
      </Text>
    </Hyperlink>
  );
};

export default HyperLinkText;
