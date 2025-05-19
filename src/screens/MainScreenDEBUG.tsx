// In App.js in a new project
import * as React from 'react';
import { View, Text, NativeEventEmitter, NativeModules, ScrollView, TouchableOpacity, Pressable, Platform, StatusBar} from 'react-native';
import { signOut } from '../api/auth/signOut';
import { verifyOtpAndPair } from '../api/pairing/verifyOtpAndPair';
import { Btn } from '../components';
import { BtnSubtle } from '../components/BtnSubtle';
import { supabase } from '../helpers/supabase';
import { useBoundStore } from '../store/useBoundStore';
import PsdkModule from '../utils/PsdkModule';
import {useState , useRef, useEffect} from 'react'
import { Logo } from '../components/Logo';
import { PSDK_STATUS_CODES } from '../config';
import { getKeyByValue } from '../utils/getKeyByValue';
import { createAboutAlert } from '../utils/createAboutAlert';
import { createLoginFailedAlert } from '../utils/createLoginFailedAlert';
import NetInfo from "@react-native-community/netinfo";
import { createDeviceOfflineAlert } from '../utils/createDeviceOfflineAlert';
import { getBatteryLevel, getBatteryLevelSync, isLowBatteryLevel, useBatteryLevelIsLow } from 'react-native-device-info';
import { LoadingScreen } from './LoadingScreen';
import { useTheme } from '../theme/useTheme';
import { useLanguage } from '../language/useLanguage';
import { getDeviceInformation } from '../utils/getDeviceInformation';
import IdleTimerManager from 'react-native-idle-timer';
import { createTerminalDisabledAlert } from '../utils/createTerminalDisabledAlert';
import ImmersiveMode from 'react-native-immersive-mode';

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
    type?: string;
    body?: {
      action?: string;
      data?: any
      metadata?: {
        sessionMode?: string
      }
    }
    
  }
}

interface CommerceListenerEventProps {
  eventCategory?: string;
  type?: string,
  data?: any,
  status?: string;
  message?: string;
  
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
type isOnline = boolean | null

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
          status,
          data: data || null
      }
   })
  return { error }
}


export const MainScreenDEBUG = ({route}: any) => {
    const TAG = 'MainScreenDEBUG'
    const theme = useTheme()
    const l = useLanguage()
    const [batteryLow, setBatteryLow] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isOnline, setIsOnline] = useState<isOnline>(true)
    const pairingId = useBoundStore((state: any) => state.pairingId)
    const resetConfig = useBoundStore((state: any) => state.reset)
    const config = useBoundStore((state: any) => state.config)
    const userId = route?.params?.userId
    const [debugMode, setDebugMode] = useState(false)
    const [requestQueue, _setRequestQueue] = useState<RequestQueue>([]);
  
    // to make the state updates possible between renders
    const requestQueueRef = useRef(requestQueue);
    const setRequestQueue = (data: any) => {
      requestQueueRef.current = data;
      _setRequestQueue(data);
    };
    console.log(TAG + ' render')

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
            total: 0.99,
            psdkConfig: {
              sendReceiptsOnPaymentCompleted: false
            }
          },
          metadata: {
            isRetry: false,
            sessionMode: 'terminate'
          } 
        }])
      } catch (e) {
        console.error(e);
      }
    }
    const psdkTeardown = async () => {
      try {
        await PsdkModule.psdkTearDown()
      } catch (e) {
        console.error(e);
      }
    }

    const psdkQueryLastTransaction = async () => {
      try {
        await PsdkModule.psdkQueryLastTransaction()
      } catch (e) {
        console.error(e);
      }
    }

    const terminalMessagesListenerCallback = async (payload: ReceivedEventProps) => {
    
        try {
          if (payload?.new?.type !== 'request') return
          if (payload?.errors && !payload?.new?.body?.action) throw `Error when received payload: ${JSON.stringify(payload.errors)}`

          const body = payload?.new?.body
          const action = body?.action
          console.log(`Request for action ${action}`)

          switch (action) {
            case 'getDeviceInfo':
              let i = await getDeviceInformation()
              await sendEvent ({userId, pairingId, eventCategory: 'DEVICE_INFO', eventType:'DEVICE_INFO', status: !i?.error ? 'SUCCESS' : 'ERROR', data: i?.data || undefined})
              break;
            case 'ping':
                await sendEvent ({userId, pairingId, eventType: 'PONG'})
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
                    total: body.data.total,
                    psdkConfig: {
                      sendReceiptsOnPaymentCompleted: !!body?.data?.psdkConfig?.sendReceiptsOnPaymentCompleted
                    }
                  },
                  metadata: {
                    isRetry: false,
                    sessionMode: body?.metadata?.sessionMode || 'terminate'
                  } 
                }, {action: 'psdkStartSession'}])
               
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
      if (config?.keepAwake) {
        IdleTimerManager.setIdleTimerDisabled(true, "payments");
      } 
      return () => IdleTimerManager.setIdleTimerDisabled(false, "payments");
    }, [config?.keepAwake])

    useEffect(() => {
      const constants: any = Platform?.constants
      if (constants?.Model === 'P630') return
      const lowBatteryCheckInterval = setInterval( async () => {
        const batteryLevel = await getBatteryLevel()
        batteryLevel < 0.3 && !batteryLow && setBatteryLow(true)
        batteryLevel >= 0.3 && batteryLow && setBatteryLow(false)
      }, 10000)
      
      return () => clearInterval(lowBatteryCheckInterval)
    },[batteryLow])

    useEffect(() => {
      const unsubscribe = NetInfo.addEventListener(state => {
        setIsOnline(state.isConnected)
      });

      return () => unsubscribe();
    },[])

    useEffect(() => {
      if (!isOnline) {
        createDeviceOfflineAlert(l.device_offline, l.device_offline_msg)
      }
    },[isOnline])

    
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
          filter: `pairing_id=eq.${pairingId}`,
          
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
          const lastAction = lastRequest?.action
          const isRetry = lastRequest?.metadata?.isRetry
          const statusCode = getKeyByValue(PSDK_STATUS_CODES, Number(e?.status))
          const handleSendEvent = async () => await sendEvent ({
            userId, 
            pairingId, 
            eventCategory: e?.eventCategory, 
            eventType:e?.type, 
            status: statusCode || e?.status,
            data: {...e?.data}
          })
          const message = e?.message
          console.log(TAG + ' START')
          console.log(TAG + ' ' + JSON.stringify(requestQueueRef.current))
          console.log(TAG + ' statusCode:' + statusCode)
          console.log(TAG + ' type:' + e?.type)
          console.log(TAG + ' message:' + e?.message)

         

          switch (e?.type) {
            case 'NOTIFICATION_EVENT':
              if (statusCode === 'DEVICE_CONNECTION_LOST') {
                setRequestQueue([...requestQueue, {action: 'psdkRestart'}])
                await handleSendEvent()
              }
              break;
            case 'TRANSACTION_PAYMENT_COMPLETED':
              console.log(statusCode)
              console.log()
              switch (statusCode) {
                case 'SUCCESS':
                case 'CANCELLED':
                case 'ABORTED':
                  console.log('Payment success/cancel/abort. Dealing with session now.')
                  if (lastAction === 'psdkSale' && lastRequest?.metadata?.sessionMode === 'restart') {
                    setRequestQueue([
                      {action: 'psdkStartSession'},
                      {action: 'psdkEndSession'}
                    ])
                  } else if (lastAction === 'psdkSale' && lastRequest?.metadata?.sessionMode === 'terminate') {
                    setRequestQueue([
                      {action: 'psdkEndSession'}
                    ])
                  }
                  await handleSendEvent()      
                  break;

                case 'INVALID_STATE':
                  if (lastAction === 'psdkSale' && lastRequest?.metadata?.isRetry === false) {
                    if (message === 'No session available') {
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
                      ])
                    } else {
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
                    }
                    
                  } else if (lastAction === 'psdkSale') {
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
                  if (lastAction === 'psdkSale') {
                    setRequestQueue([...requests.slice(0, -1)])
                  }
                  await handleSendEvent() 
                  break;
              }
              
              break;
            case 'LOGIN_COMPLETED':

            
              switch (statusCode) {
                case 'SUCCESS':
                  lastAction === 'psdkLogin' && setRequestQueue([...requests.slice(0, -1)])
                  await handleSendEvent()
                  break;
                
                case 'INVALID_STATE':

                  if (message === 'Action Login is not allowed in state Logged In' || message === 'Action Login is not allowed in state Loggin In') {
                    lastAction === 'psdkLogin' && setRequestQueue([...requests.slice(0, -1)]) 
                    sendEvent ({
                      userId, 
                      pairingId, 
                      eventCategory: e?.eventCategory, 
                      eventType:e?.type, 
                      status: 'SUCCESS',
                      data: {...e?.data}
                    })
                    break
                  }

                  if (lastAction === 'psdkLogin' && !isRetry) {
                    setRequestQueue([
                      ...requests.slice(0, -1),
                      {
                        action: 'psdkLogin',
                        metadata: {isRetry: true}
                      },
                      {action: 'psdkRestart'}
                    
                    ])
                  } else if (lastAction === 'psdkLogin') {
                    setRequestQueue([...requests.slice(0, -1)])
                    config.displayAlertsOnDevice && createLoginFailedAlert(l.login_failed, l.login_failed_msg)
                  }
                  
                  break;
                
                case 'DEVICE_CONNECTION_LOST':
                  if (lastAction === 'psdkLogin' && !isRetry) {
                    setRequestQueue([
                      ...requests.slice(0, -1),
                      {
                        action: 'psdkLogin',
                        metadata: {isRetry: true}
                      },
                      {action: 'psdkRestart'}
                    
                    ])
                  } else if (lastAction === 'psdkLogin') {
                    setRequestQueue([...requests.slice(0, -1)])
                    config.displayAlertsOnDevice && createLoginFailedAlert(l.login_failed, l.login_failed_msg)
                  }
                  
                  break;
      
                default:
                  lastAction === 'psdkLogin' && setRequestQueue([...requests.slice(0, -1)]) 
                  config.displayAlertsOnDevice && createLoginFailedAlert(l.login_failed, l.login_failed_msg)
                  await handleSendEvent()
                  break;
              }
               
              
              
              
              break;  

            case 'SESSION_STARTED':
                  if (statusCode === 'SUCCESS') {
                    if (lastAction === 'psdkStartSession') {
                      setRequestQueue([...requests.slice(0, -1)])
                    }
                    console.log('logged in to psdk')
                  } else {

                    if (lastAction !== 'psdkStartSession') break
                    if (!lastRequest?.metadata?.isRetry) {
                      setRequestQueue([
                        ...requests.slice(0, -1),
                        {
                          action: 'psdkStartSession',
                          metadata: {
                            ...lastRequest.metadata,
                            isRetry: true
                          }
  
                        },
                        {action: 'psdkLogin'}
                      ])
                    } else {
                      setRequestQueue([...requests.slice(0, -1)])
                    }
                    
                    
                    
                  }
                  
                  
             
              await handleSendEvent()
              break;
            case 'SESSION_ENDED':
              switch (statusCode) {
                case 'SUCCESS':

                  if (lastAction === 'psdkEndSession') {
                    setRequestQueue([...requests.slice(0, -1)])
                  }
                  
                  break;
              
                default:
                  break;
              }
              await handleSendEvent()
              break;

            case 'STATUS_INITIALIZED':
              if (lastAction === 'psdkRestart' || 'psdkInit') {
                setRequestQueue([...requests.slice(0, -1)])
              }
              break;
          
            default:
              await handleSendEvent() 
              break;
          }

          console.log(TAG + ' END')

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
              setTimeout(initPsdk, metadata?.initDelay || 3000)
              break;
            case 'psdkSale':
              if (data?.total && data?.psdkConfig) {
                PsdkModule.psdkSale(Number(data?.total) || 3.5, !!data.psdkConfig.sendReceiptsOnPaymentCompleted)
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

  useEffect(() => {
    ImmersiveMode.setBarMode('Bottom')
    ImmersiveMode.setBarTranslucent(true)
  }, [])

  // useEffect(() => {
  //   if (config?.is_enabled === false) {
  //     supabase.removeAllChannels()
  //     createTerminalDisabledAlert('Terminal is disabled', 'Please contact Kassandra Support.')
  //   }
  // },[config])

  if (loading) {return <LoadingScreen msg={"Connecting to payment service.."}/>}


  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background }}>
        <StatusBar barStyle={theme.theme === 'dark' ? 'light-content' : 'dark-content'} translucent hidden={false}   />

      {batteryLow && <View style={{ width:'100%', position:'absolute', backgroundColor:'orange', top:0, justifyContent:'center', alignItems:'center'}}><Text style={{fontWeight:'700'}}>{l.battery_low}</Text></View>}
      {debugMode ?
        <ScrollView style={{flex:1,width:'100%'}}>
          <Text style={{fontSize:20, color:'red',fontWeight:'700'}}>{TAG}</Text>
          <Text style={{fontSize:10, color:'blue',fontWeight:'700'}}>Pairing id:{pairingId || 'unknown'} User id: {userId}</Text>

          <Btn label='Simulate an alert' onPress={createLoginFailedAlert}/>

          <Btn label='Init psdk' onPress={initPsdk}/>
          <Btn label='Login psdk' onPress={loginPsdk}/>
          <Btn label='Start session' onPress={startSessionPsdk}/>
          <Btn label='Start payment' onPress={startPaymentPsdk}/>
          <Btn label='Teardown psdk' onPress={psdkTeardown}/>
          <Btn label='Query last payment' onPress={psdkQueryLastTransaction}/>

          <Btn label='Disconnect realtime' onPress={() => supabase.removeAllChannels()}/>
          <Btn label="Reset config" onPress={resetConfig}/>
          <Btn label="Sign out" onPress={signOut}/>
          <BtnSubtle label='Toggle debug' onPress={() => setDebugMode(!debugMode)}/>

        </ScrollView>
      :
       
       <>
        <Pressable onLongPress={createAboutAlert}  >
          <Logo/>
        </Pressable>
        <Text style={{fontSize:22,fontWeight:'500', color:theme.colors.text,textShadowColor:theme.colors.accent,textShadowRadius:2,shadowOpacity:0.1,marginBottom:20}}>{config?.customGreeting || l.start_payment}</Text>
        <BtnSubtle label='toggle debug' onPress={() => setDebugMode(!debugMode)}/>

       </>

      }
      
      
    </View>
  );
}
