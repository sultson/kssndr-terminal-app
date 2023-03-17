// In App.js in a new project
import * as React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
export const LoadingScreen = ({msg}: {msg?: string}) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size='large' color={colors.primary}/>
      {msg && <Text>{msg}</Text>}
    </View>
  );
}
