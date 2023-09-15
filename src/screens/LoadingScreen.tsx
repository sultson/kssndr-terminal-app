// In App.js in a new project
import * as React from 'react';
import { View, Text, ActivityIndicator, StatusBar } from 'react-native';
import { colors } from '../theme/colors';
import { useTheme } from '../theme/useTheme';
export const LoadingScreen = ({msg}: {msg?: string}) => {
  const theme = useTheme()
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background}}>
      <StatusBar barStyle={theme.theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.theme === 'dark' ? 'black' : 'white'} translucent hidden={false}   />

      <ActivityIndicator size='large' color={theme.colors.accent}/>
      {msg && <Text style={{color: theme.colors.text}}>{msg}</Text>}
    </View>
  );
}
