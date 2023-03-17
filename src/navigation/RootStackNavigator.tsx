// In App.js in a new project
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SignInScreen } from '../screens/SignInScreen';
import { useState, useEffect } from 'react'
import { supabase } from '../helpers/supabase';
import 'react-native-url-polyfill/auto'
import { GetStartedScreen } from '../screens/GetStartedScreen';
import { OtpScreen } from '../screens/OtpScreen';
import { LoadingScreen } from '../screens/LoadingScreen';
import { useBoundStore } from '../store/useBoundStore';
import { MainScreen } from '../screens/MainScreen';


const Stack = createNativeStackNavigator();

export const RootStackNavigator = () => {
    const [session, setSession] = useState({user: {id: null}})
    const [init, setInit] = useState(true)
    const pairingId = useBoundStore((state: any) => state.pairingId)
    console.log(pairingId)
    console.log(JSON.stringify(session))
    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
          const session: any  = data.session
          setSession(session)
          setInit(false)
        })
    
        supabase.auth.onAuthStateChange((_event, session: any) => {
          setSession(session)
        })
    }, [])

    if (init) {return <LoadingScreen msg={"Initializing.."}/>}

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}}>
        {session?.user?.id ?  
          
            pairingId ? 
            
              <Stack.Screen name="Main" component={MainScreen} initialParams={{ userId: session.user.id }} />   
          
              :
          
              <>
                <Stack.Screen name="GetStarted" component={GetStartedScreen} /> 
                <Stack.Screen name="Otp" component={OtpScreen} /> 
              </>
        : 

            <Stack.Screen name="SignIn" component={SignInScreen} />

        }
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
