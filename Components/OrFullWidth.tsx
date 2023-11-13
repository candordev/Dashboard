import React from 'react';
import {View} from 'react-native';
import Text from './Text';
import colors from '../Styles/colors';

function OrFullWidth() {
    return (
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
          <View
            style={{
              borderBottomColor: colors.lightgray,
              borderBottomWidth: 1,
              flex: 1,
              height: 4,
            }}
          />
          <Text style={{fontSize: 14, color: colors.gray, }}>{'    '}or{'    '}</Text>
          <View
            style={{
              borderBottomColor: colors.lightgray,
              borderBottomWidth: 1,
              flex: 1,
              height: 4,
            }}
          />
        </View>
    )
}

export default OrFullWidth;