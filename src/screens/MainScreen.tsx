// In App.js in a new project
import * as React from 'react';
import { View, Text, NativeEventEmitter, NativeModules, ScrollView, TouchableOpacity, Pressable} from 'react-native';
import { signOut } from '../api/auth/signOut';
import { verifyOtpAndPair } from '../api/pairing/verifyOtpAndPair';
import { Btn } from '../components';
import { BtnSubtle } from '../components/BtnSubtle';
import { supabase } from '../helpers/supabase';
import { useBoundStore } from '../store/useBoundStore';
import { colors } from '../theme/colors';
import PsdkModule from '../utils/PsdkModule';
import {useState , useRef, useEffect} from 'react'
import { Logo } from '../components/Logo';
import { PSDK_STATUS_CODES } from '../config';
import { getKeyByValue } from '../utils/getKeyByValue';
import { createAboutAlert } from '../utils/createAboutAlert';
import { createLoginFailedAlert } from '../utils/createLoginFailedAlert';
import NetInfo from "@react-native-community/netinfo";
import { createDisconnectedAlert } from '../utils/createDisconnectedAlert';
import { isLowBatteryLevel, useBatteryLevelIsLow } from 'react-native-device-info';
import { LoadingScreen } from './LoadingScreen';

interface SendEventProps {
  userId: string;
  pairingId: string;
  eventCategory?: string;
  eventType?: string;
  status?: string;
  data?: object;
}

interface ReceivedEventProps {
  errors?: any;
  new?: {
    body?: {
      action?: string;
      data?: any
    }
  }
}

interface CommerceListenerEventProps {
  eventCategory?: string;
  type?: string,
  data?: any,
  status?: string
  
}

interface RequestQueueItemProps {
  action: string;
  data?: object;
  metadata?: {
    sessionMode?: string;
    isRetry: boolean;

  }
}
type RequestQueue = RequestQueueItemProps[]
type IsConnected = boolean | null

const sendEvent  = async ({userId, pairingId, eventCategory, eventType, status, data}: SendEventProps) => {
    
  const { error } = await supabase
  .from('terminal_messages')
  .insert({ 
      pairing_id: pairingId,
      sender_id: userId,
      type: 'event',
      body: {
          category: eventCategory,
          type: eventType,
          status
      }
   })
  return { error }
}


export const MainScreen = ({route}: any) => {
    const TAG = 'MainScreen'
    const batteryLevelIsLow = useBatteryLevelIsLow()
    const [loading, setLoading] = useState(false)
    const [isConnected, setIsConnected] = useState<IsConnected>(true)
    const [psdkStatus, setPsdkStatus] = React.useState('unknown')
    const pairingId = useBoundStore((state: any) => state.pairingId)
    const resetConfig = useBoundStore((state: any) => state.reset)
    const userId = route?.params?.userId
    const [debugMode, setDebugMode] = useState(true)
    const [requestQueue, _setRequestQueue] = useState<RequestQueue>([]);
    // to make the state updates possible between renders
    const requestQueueRef = useRef(requestQueue);
    const setRequestQueue = (data: any) => {
      requestQueueRef.current = data;
      _setRequestQueue(data);
    };
    console.log(TAG + ' render')

  
    const handlePair = async () => {
      await verifyOtpAndPair({otp: 550885})
    }

    const initPsdk = async () => {
      try {
        await PsdkModule.psdkInit()
      } catch (e) {
        console.error(e);
      }
    }
    const loginPsdk = async () => {
      try {
        await PsdkModule.psdkLogin()
      } catch (e) {
        console.error(e);
      }
    }
    const startSessionPsdk = async () => {
      try {
        await PsdkModule.psdkStartSession()
      } catch (e) {
        console.error(e);
      }
    }
    const startPaymentPsdk = async (total = 3) => {
      try {
        setRequestQueue([{
          action: 'psdkSale',
          data: {
            total: 69
          },
          metadata: {
            isRetry: false,
            sessionMode: 'terminate'
          } 
        }])
        //await PsdkModule.psdkSale(3)
      } catch (e) {
        console.error(e);
      }
    }
    const psdkTeardown = async () => {
      try {
        let total = 3.5
        await PsdkModule.psdkTearDown()
      } catch (e) {
        console.error(e);
      }
    }

    const terminalMessagesListenerCallback = async (payload: ReceivedEventProps) => {
    
        try {
          if (payload?.errors && !payload?.new?.body?.action) throw `Error when received payload: ${JSON.stringify(payload.errors)}`
          const body = payload?.new?.body
          const action = body?.action
          console.log(`Request for action ${action}`)

          switch (action) {
            case 'ping':
                await sendEvent ({userId, pairingId, eventCategory: 'pong', eventType:'pong', status:'0'})
              break;
            case 'psdkInit':
              await PsdkModule.psdkInit()
              break;
            case 'psdkLogin':
              setRequestQueue([{action:'psdkLogin'}])
              break;
            case 'psdkLogout':
              setRequestQueue([{action:'psdkLogout'}])
              break;
            case 'psdkStartSession':
              setRequestQueue([{action:'psdkStartSession'}])
              break;
            case 'psdkEndSession':
              setRequestQueue([{action:'psdkEndSession'}])
              break;
            case 'psdkTearDown':
              setRequestQueue([{action:'psdkTearDown'}])
              break;
            case 'psdkRestart':
              setRequestQueue([{action:'psdkRestart', metadata: {initDelay: 3000}}])
              break;
          
            case 'psdkSale':
              if (body?.data?.total) {
                setRequestQueue([{
                  action: 'psdkSale',
                  data: {
                    total: body.data.total
                  },
                  metadata: {
                    isRetry: false,
                    sessionMode: 'terminate'
                  } 
                }])
               
              }
              
              break;
            
            default:
              break;
          }

        } catch ( error ) {
          console.log( error )
        }
      
    }


    useEffect(() => {
      const unsubscribe = NetInfo.addEventListener(state => {
        setIsConnected(state.isConnected)
      });

      return () => unsubscribe();
    },[])

    useEffect(() => {
      if (!isConnected) {
        createDisconnectedAlert()
      }
    },[isConnected])

    
    useEffect(() => {
      if (!(userId && pairingId)) return
      const channel = supabase
      .channel('terminal-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'terminal_messages',
          filter: `sender_id=neq.${userId}`,
          // filter: 'type=eq.request',
          // filter: `pairing_id=eq.${pairingId}`
        },
        async (payload) => await terminalMessagesListenerCallback(payload)
      )
      .subscribe(
        (s) => {
          console.log(`Channel subscription status: ${s}`)
        }
      )

      async function removeSubscription() {
        await supabase.removeChannel(channel)
      }
      return () => {
        removeSubscription()
      }
    }, [userId, pairingId])


    const commerceListenerCallback = async (e: CommerceListenerEventProps) => {
      
          const TAG = `MainScreen/commerceListenerCallback`
          const requests = requestQueueRef?.current
          const lastRequest: RequestQueueItemProps = requestQueueRef?.current?.[requestQueueRef?.current?.length - 1]
          const statusCode = getKeyByValue(PSDK_STATUS_CODES, Number(e?.status))
          const handleSendEvent = async () => await sendEvent ({
            userId, 
            pairingId, 
            eventCategory: e?.eventCategory, 
            eventType:e?.type, 
            status: statusCode || e?.status,
            data: {...e?.data}
          })

          console.log(TAG + ' START')
          console.log(TAG + ' ' + JSON.stringify(requestQueueRef.current))
          console.log(e)
          console.log(TAG + ' statusCode:' + statusCode)
          console.log(TAG + ' type:' + e?.type)
          console.log(e?.data)

          switch (e?.type) {
            case 'TRANSACTION_PAYMENT_COMPLETED':

              switch (statusCode) {
                case 'SUCCESS' || 'CANCELLED' || 'ABORTED':
                  if (lastRequest?.action === 'psdkSale' && lastRequest?.metadata?.sessionMode === 'restart') {
                    setRequestQueue([
                      {action: 'psdkStartSession'},
                      {action: 'psdkEndSession'}
                    ])
                  } else if (lastRequest?.action === 'psdkSale' && lastRequest?.metadata?.sessionMode === 'terminate') {
                    setRequestQueue([
                      {action: 'psdkEndSession'}
                    ])
                  }
                  await handleSendEvent()      
                  break;

                case 'INVALID_STATE':
                  if (lastRequest?.action === 'psdkSale' && lastRequest?.metadata?.isRetry === false) {
                    setRequestQueue([
                      ...requests.slice(0, -1),
                      {
                        action: 'psdkSale',
                        data: {...lastRequest.data},
                        metadata: {
                          ...lastRequest.metadata,
                          isRetry: true
                        }

                      },
                      {action: 'psdkStartSession'},
                      {action: 'psdkLogin'}
                    ])
                  } else if (lastRequest?.action === 'psdkSale') {
                    setRequestQueue([...requests.slice(0, -1)])
                    await handleSendEvent() 
                  }
                  break;
                
                case 'DEVICE_CONNECTION_LOST':
                  setRequestQueue([
                    {action: 'psdkQueryLastTransaction'},
                    {action: 'psdkLogin'},
                    {action: 'psdkRestart'}
                  ])
              
                default:
                  if (lastRequest?.action === 'psdkSale') {
                    setRequestQueue([...requests.slice(0, -1)])
                  }
                  await handleSendEvent() 
                  break;
              }
              
              break;
            case 'LOGIN_COMPLETED':

              if (statusCode === 'SUCCESS') {
                if (lastRequest?.action === 'psdkLogin') {
                  setRequestQueue([...requests.slice(0, -1)])
                }
                console.log('logged in to psdk')
              } else {
                createLoginFailedAlert()
              }
               
              
              
              await handleSendEvent()
              break;  

            case 'SESSION_STARTED':
              
                  if (lastRequest?.action === 'psdkStartSession') {
                    setRequestQueue([...requests.slice(0, -1)])
                  }
                  
             
              await handleSendEvent()
              break;
            case 'SESSION_ENDED':
              switch (statusCode) {
                case 'SUCCESS':

                  if (lastRequest?.action === 'psdkEndSession') {
                    setRequestQueue([...requests.slice(0, -1)])
                  }
                  
                  break;
              
                default:
                  break;
              }
              await handleSendEvent()
              break;
          
            default:
              await handleSendEvent() 
              break;
          }

          console.log(TAG + 'END')

    }

    useEffect(() => {
        if (!(userId && pairingId)) return
        initPsdk()
        const eventEmitter = new NativeEventEmitter(NativeModules.PsdkModule);
        const subscription = eventEmitter.addListener("CommerceListenerEvent", async (e) => await commerceListenerCallback(e));
        return () => subscription.remove()
    }, [userId, pairingId]);


    useEffect(() => {
        const TAG = `MainScreen/requestQueueHandler`
        if (!(userId && pairingId)) return
        if (requestQueue.length === 0) return
        console.log(TAG + ' \n START');
        try {
          const action: string | null = requestQueue?.[requestQueue.length - 1]?.action
          const data: any | null = requestQueue?.[requestQueue.length - 1]?.data
          const metadata: any | null = requestQueue?.[requestQueue.length - 1]?.metadata
          if (!action) throw 'No action specified in queue'
          switch (action) {
            case 'psdkInit':
              PsdkModule.psdkInit()
              break;
            case 'psdkLogin':
              PsdkModule.psdkLogin()
              break;
            case 'psdkLogout':
              PsdkModule.psdkLogout()
              break;
            case 'psdkStartSession':
              PsdkModule.psdkStartSession()
              break;
            case 'psdkEndSession':
              PsdkModule.psdkEndSession()
              break;
            case 'psdkTearDown':
              PsdkModule.psdkTearDown()
              break;
            case 'psdkRestart':
              PsdkModule.psdkTearDown()
              setTimeout(PsdkModule.psdkInit(), metadata?.initDelay || 3000)
              break;
            case 'psdkSale':
              if (data?.total) {
                PsdkModule.psdkSale(Number(data?.total) || 3.5)
              } 
              break;
            case 'psdkQueryLastTransaction':
              PsdkModule.psdkQueryLastTransaction()
            
            default:
              console.log(`${TAG}: Received an invalid action.`)
              break;
          }
        } catch (error) {
          console.log(`ERROR in ${TAG} \n ${error}`)
        }
        
        

  }, [userId, pairingId, requestQueue]);

  if (loading) {return <LoadingScreen msg={"Connecting to payment service.."}/>}


  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {debugMode ?
        <ScrollView style={{flex:1,width:'100%'}}>
          <Text style={{fontSize:30, color:'red',fontWeight:'700'}}>MainScreen</Text>
          <Text style={{fontSize:10, color:'blue',fontWeight:'700'}}>Pairing id:{pairingId || 'unknown'} User id: {userId}</Text>

          <Text style={{fontSize:20,fontWeight:'700'}}>{psdkStatus}</Text>
          <Btn label='display login failed alert' onPress={createLoginFailedAlert}/>

          <Btn label='init psdk' onPress={initPsdk}/>
          <Btn label='login psdk' onPress={loginPsdk}/>
          <Btn label='start session' onPress={startSessionPsdk}/>
          <Btn label='start payment' onPress={startPaymentPsdk}/>
          <Btn label='teardown psdk' onPress={psdkTeardown}/>
          <Btn label='PANIK supa disconnect' onPress={() => supabase.removeAllChannels()}/>
          <Btn label="reset config" onPress={resetConfig}/>
          <Btn label="Sign out" onPress={signOut}/>
          <BtnSubtle label='toggle debug' onPress={() => setDebugMode(!debugMode)}/>

        </ScrollView>
      :
       
       <>
        <Pressable onLongPress={createAboutAlert}  >
          <Logo/>
        </Pressable>
        <Text style={{fontSize:22,fontWeight:'500', color:'black',textShadowColor:'blue',textShadowRadius:2,shadowOpacity:0.1,marginBottom:20}}>ALUSTA MAKSET</Text>
        <BtnSubtle label='toggle debug' onPress={() => setDebugMode(!debugMode)}/>

       </>

      }
      
      
    </View>
  );
}
