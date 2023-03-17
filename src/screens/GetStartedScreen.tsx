import * as React from 'react';
import { View  } from 'react-native';
import { Btn } from '../components';
import { Logo } from '../components/Logo';


export const GetStartedScreen = ({ navigation }: any) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding:50 }}>
        <Logo/>
        <Btn label="Get started" onPress={() => navigation.navigate('Otp')}/>
    </View>
  );
}