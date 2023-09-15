import * as React from 'react';
import { View, StatusBar } from 'react-native';
import { Btn } from '../components';
import { Logo } from '../components/Logo';
import { useLanguage } from '../language/useLanguage';
import { useBoundStore } from '../store/useBoundStore';
import { useTheme } from '../theme/useTheme';
import ImmersiveMode from 'react-native-immersive-mode';


export const GetStartedScreen = ({ navigation }: any) => {
  const theme = useTheme()
  const l = useLanguage()

  React.useEffect(() => {
    ImmersiveMode.setBarMode('Bottom')
    ImmersiveMode.setBarTranslucent(false)
  }, [])
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding:50, backgroundColor: theme.colors.background }}>
          <StatusBar barStyle={theme.theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.theme === 'dark' ? 'black' : 'white'} translucent hidden={false}   />

        <Logo/>
        <Btn label={l.get_started} onPress={() => navigation.navigate('Otp')}/>
    </View>
  );
}