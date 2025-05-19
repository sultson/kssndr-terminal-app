import * as React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Keyboard, StatusBar } from 'react-native';
import { Btn } from '../components';
import { Logo } from '../components/Logo';
import { colors } from '../theme/colors';
import { Title } from '../components/TItle';
import { BtnSubtle } from '../components/BtnSubtle';
import { supabaseTestFunc } from '../api/test/supabaseTestFunc';
import { verifyOtpAndPair } from '../api/pairing/verifyOtpAndPair';
import { useState, useEffect } from 'react';
import { LoadingScreen } from './LoadingScreen';
import OTPInput from '../components/OTPInput';
import { createOtpVerificationFailedAlert } from '../utils/createOtpVerificationFailedAlert';
import { useLanguage } from '../language/useLanguage';
import { useTheme } from '../theme/useTheme';
import { createOTPHelpAlert } from '../utils/createOTPHelpAlert';
import ImmersiveMode from 'react-native-immersive-mode';

export const OtpScreen = () => {
    const theme = useTheme()
    const [otp, setOtp] = useState('')
    const [isOtpReady, setIsOtpReady] = useState(false)
    const [loading, setLoading] = useState(false)
    const l = useLanguage()
    const handleVerifyOtp = async () => {
        if (!otp) {
            console.warn('empty otp')
            return null
        }
        setOtp('')
        setLoading(true)
        const { error } = await verifyOtpAndPair({otp: Number(otp)})
        setLoading(false)
        if ( error ) {createOtpVerificationFailedAlert(l.otp_failed,error)}
    }

    useEffect(() => {
        if (isOtpReady) {
            Keyboard.dismiss()
        }
    },[isOtpReady])

    useEffect(() => {
        ImmersiveMode.setBarMode('Bottom')
        ImmersiveMode.setBarTranslucent(false)
      }, [])

    if (loading) {return <LoadingScreen msg={l.verifying}/>}

   

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor:theme.colors.background}}>
            <StatusBar barStyle={theme.theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.theme === 'dark' ? 'black' : 'white'} translucent hidden={false}   />

            <Text style={{fontSize:30,color:theme.colors.accent,maxWidth:'80%', fontWeight:'600',marginBottom:0,width:250}}>{l.pair_to_pos}</Text>
            <Text style={{color: theme.colors.secondary, width:250,textAlign:'left',marginBottom:30}}>{l.pos_explanation}</Text>
            {/* <OTPTextInput 
                ref={otpInput}
                containerStyle={{height:100}} 
                textInputStyle={{borderWidth:4,borderRadius:10,backgroundColor:'white',height:70, fontWeight:'700'}}
                inputCount={4}
                handleTextChange={(e) => setOtp(e)}
                
            /> */}
             <OTPInput
                code={otp}
                setCode={setOtp}
                maximumLength={4}
                setIsPinReady={setIsOtpReady}
            />
            <View style={{marginBottom:20}}/>

            {isOtpReady ? <Btn label={l.verify_code} onPress={handleVerifyOtp}/> : null}
            <BtnSubtle label={l.need_help} onPress={() => createOTPHelpAlert(l.otp_help,l.otp_help_msg)}/>
        </View>
    );
}

