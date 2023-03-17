// In App.js in a new project
import * as React from 'react';
import { useState } from 'react';
import { Alert, StyleSheet, View, Text, TextInput } from 'react-native'
import { signIn } from '../api/auth/signIn';
import { Btn, Input } from '../components';
import { colors } from '../theme/colors';
import { LoadingScreen } from './LoadingScreen';


export const SignInScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await signIn({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  if (loading) {
    return <LoadingScreen/>
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Text style={{fontSize:30,color:colors.primary,maxWidth:'80%', fontWeight:'600',marginBottom:20}}>Sign in to Kassandra</Text>
        <Input
          label="Email"
          onChangeText={(text: string) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
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
    marginTop: 20,
  },
})