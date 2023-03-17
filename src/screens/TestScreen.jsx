// In App.js in a new project
import * as React from 'react';
import { View, Text, NativeEventEmitter, NativeModules, ScrollView} from 'react-native';
import { signOut } from '../api/auth/signOut';
import { verifyOtpAndPair } from '../api/pairing/verifyOtpAndPair';
import { Btn } from '../components';
import { BtnSubtle } from '../components/BtnSubtle';
import { supabase } from '../helpers/supabase';
import { useBoundStore } from '../store/useBoundStore';
import { colors } from '../theme/colors';
import PsdkModule from '../utils/PsdkModule';


export const TestScreen = ({route}) => {
    const [psdkStatus, setPsdkStatus] = React.useState('unknown')
    const pairingId = useBoundStore(state => state.pairingId)
    const resetConfig = useBoundStore(state => state.reset)
    const userId = route?.params?.userId
  
    const handlePair = async () => {
      await verifyOtpAndPair({otp: 550885})
    }

    const initPsdk2 = () => {
      PsdkModule.psdkStartSession(
        (error) => {
          if (error) {
            console.error(`Error found! ${error}`);
          }
        },
      );
    };

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
    const startPaymentPsdk = async () => {
      try {
        let total = 3.5
        await PsdkModule.psdkSale(total)
      } catch (e) {
        console.error(e);
      }
    }
    const psdkTeardown = async () => {
      try {
        let total = 3.5
        await PsdkModule.tearDown()
      } catch (e) {
        console.error(e);
      }
    }


    
    React.useEffect(() => {
      const channel = supabase
      .channel('terminal-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'terminal_messages',
          filter: `sender_id=neq.${userId}`,
        },
        (payload) => console.log(payload)
      )
      .subscribe()

      async function removeSubscription() {
        await supabase.removeChannel(channel)
      }
      return () => {
        removeSubscription()
      }
    }, [])
    React.useEffect(() => {
        console.log("TestScreen/useEffect listener")
        //init({pairingId})
        initPsdk()
        const eventEmitter = new NativeEventEmitter(NativeModules.PsdkModule);
        const subscription = eventEmitter.addListener("CommerceListenerEvent", (e) => {
          console.log(e)
          switch (e.eventCategory) {
            case "Status":
              
              break;
          
            default:
              break;
          }
          //sendPusherEvent({channelName:`private-${pairingId}`,  eventName: `client-${e.eventCategory}`, data: JSON.stringify(e)})
        });
        
    }, []);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ScrollView style={{flex:1,width:'100%'}}>
        <Text style={{fontSize:30, color:'red',fontWeight:'700'}}>WOOOOOOO</Text>
        <Text style={{fontSize:10, color:'blue',fontWeight:'700'}}>Pairing id:{pairingId || 'unknown'} User id: {userId}</Text>
        <Text style={{fontSize:20,fontWeight:'700'}}>{psdkStatus}</Text>
        <Btn label='init psdk' onPress={initPsdk}/>
        <Btn label='login psdk' onPress={loginPsdk}/>
        <Btn label='start session' onPress={startSessionPsdk}/>
        <Btn label='start payment' onPress={startPaymentPsdk}/>
        <Btn label='teardown psdk' onPress={psdkTeardown}/>

        {/* <Btn label='otp & pair' onPress={handlePair}/> */}
        {/* <Btn label='start mainPusherService' onPress={mainPusherService}/> */}
        {/* <Btn label='reset config' onPress={resetConfig}/> */}
        <BtnSubtle label="Sign out" onPress={signOut}/>
      </ScrollView>
      
    </View>
  );
}
