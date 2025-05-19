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
import { MainScreenDEBUG } from '../screens/MainScreenDEBUG';

interface TerminalDocUpdateProps {
  errors?: any;
  new: {
    config?: any;
    is_enabled?: boolean;
    account_id?: string;
    pairing_id?: string;
  }
}




const Stack = createNativeStackNavigator();

export const RootStackNavigator = () => {
    const TAG = 'navigation/RootStackNavigator'
    const [session, setSession] = useState({user: {id: null}})
    const [init, setInit] = useState(true)
    const pairingId = useBoundStore((state: any) => state.pairingId)
    const updateConfig = useBoundStore((state: any) => state.updateConfig)
    const config = useBoundStore((state: any) => state.config)
    const updateAccountId = useBoundStore((state: any) => state.updateAccountId)
    const updatePairingId = useBoundStore((state: any) => state.updatePairingId)

    console.log(TAG + ' RENDER')

    async function getConfig(id: string) {
      const { data, error } = await supabase
      .from('terminals')
      .select()
      .eq('id', id)
      if (error) {
        console.log(error)
        return
      }

      const initUpdate : TerminalDocUpdateProps = {
        errors: null,
        new: {
          config: data?.[0]?.config,
          is_enabled: data?.[0]?.is_enabled,
          account_id: data?.[0]?.account_id,
          pairing_id: data?.[0]?.pairing_id
        }
      }
      terminalDocListenerCallback(initUpdate)
    }

    async function terminalDocListenerCallback(update: TerminalDocUpdateProps) {
      try {
        //console.log(TAG + ` got update: ${JSON.stringify(update)}`)
        if (update?.errors || !update?.new?.config) throw `Error when received payload: ${JSON.stringify(update?.errors)}`
        const config = update.new.config
        if (!config?.language || !config?.appearance) throw `Invalid config received..`
        updateConfig(config)
        updateAccountId(update?.new?.account_id)
        updatePairingId(update?.new?.pairing_id)

      } catch (error) {
        console.log(error)
      }
    }

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
    
    useEffect(() => {
      if (!(session?.user?.id)) {
        updatePairingId(null)
        return
      } 
      getConfig(session.user.id)
      const channel = supabase
      .channel('terminal-doc')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'terminals',
          filter: `id=eq.${session.user.id}`

        },
        async (update) => await terminalDocListenerCallback(update)
      )
      .subscribe(
        (s) => {
          //console.log(`${TAG}: Channel subscription status: ${s}`)
        }
      )

      async function removeSubscription() {
        await supabase.removeChannel(channel)
      }
      return () => {
        removeSubscription()
      }
    }, [session])

    if (init) {return <LoadingScreen msg={"Initializing.."}/>}

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown:false}}>
        {session?.user?.id ?  
          
            pairingId ? 
            
              <Stack.Screen name="Main" component={config?.debugMode ? MainScreenDEBUG : MainScreen} initialParams={{ userId: session.user.id }} />   
          
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
