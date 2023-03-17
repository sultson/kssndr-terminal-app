import * as React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Keyboard } from 'react-native';
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

export const OtpScreen = () => {
    const [otp, setOtp] = useState('')
    const [isOtpReady, setIsOtpReady] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleVerifyOtp = async () => {
        if (!otp) {
            console.warn('empty otp')
            return null
        }
        console.log(otp)
        setOtp('')
        setLoading(true)
        const { error } = await verifyOtpAndPair({otp: Number(otp)})
        setLoading(false)
        if ( error ) {createOtpVerificationFailedAlert(error)}
    }

    useEffect(() => {
        if (isOtpReady) {
            Keyboard.dismiss()
        }
    },[isOtpReady])

    if (loading) {return <LoadingScreen msg={"Verifying.."}/>}

   

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontSize:30,color:colors.primary,maxWidth:'80%', fontWeight:'600',marginBottom:0,width:250}}>Pair to POS</Text>
            <Text style={{width:250,textAlign:'left',marginBottom:30}}>Enter the verification code to connect your terminal to the POS app.</Text>
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

            {isOtpReady ? <Btn label="Verify code" onPress={handleVerifyOtp}/> : null}
            <BtnSubtle label="Need help?"/>
        </View>
    );
}

