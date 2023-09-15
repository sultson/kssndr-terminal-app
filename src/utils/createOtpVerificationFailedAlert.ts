import { Alert} from 'react-native';



export const createOtpVerificationFailedAlert = async  (title: string, error: string) => {
    try {
      
        Alert.alert(title, 
        `${error}`, 
        [{text: 'OK', onPress: () => console.log('OK Pressed')},]
        );
    } catch (e) {
        console.error(e);
    }
   

}