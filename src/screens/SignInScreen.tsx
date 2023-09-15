// In App.js in a new project
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View, Text, TextInput, StatusBar } from 'react-native'
import { signIn } from '../api/auth/signIn';
import { Btn, Input } from '../components';
import { colors } from '../theme/colors';
import { useTheme } from '../theme/useTheme';
import { LoadingScreen } from './LoadingScreen';
import { createAboutAlert } from '../utils/createAboutAlert';
import ImmersiveMode from 'react-native-immersive-mode';

export const SignInScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const theme = useTheme()
  async function signInWithEmail() {
    setLoading(true)
    const { error } = await signIn({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  useEffect(() => {
    ImmersiveMode.setBarMode('Bottom')
    ImmersiveMode.setBarTranslucent(false)
  }, [])

  if (loading) {
    return <LoadingScreen/>
  }



  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <StatusBar barStyle={theme.theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.theme === 'dark' ? 'black' : 'white'} translucent hidden={false}   />

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Text  onPress={createAboutAlert} style={{fontSize:30,color:theme.colors.accent,maxWidth:'80%', fontWeight:'700',marginBottom:20}}>Sign in to Kassandra</Text>
        <Input
          label="Email"
          onChangeText={(text: string) => setEmail(text)}
          value={email}
          placeholder="Email"
          autoCapitalize={'none'}
          
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text: string) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Btn label="Sign in" disabled={loading} onPress={() => signInWithEmail()} />
      </View>
     
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 12,
    justifyContent:'center',
    alignItems:'center',
    flex:1,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
   
  },
  mt20: {
    marginTop: 15,
  },
})