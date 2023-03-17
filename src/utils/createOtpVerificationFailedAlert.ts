import { Alert} from 'react-native';



export const createOtpVerificationFailedAlert = async  (error: string) => {
    try {
      
        Alert.alert('OTP verification failed', 
        `${error}`, 
        [{text: 'OK', onPress: () => console.log('OK Pressed')},]
        );
    } catch (e) {
        console.error(e);
    }
   

}