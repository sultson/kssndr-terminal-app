import {Alert} from 'react-native';


export const createOTPHelpAlert = async  (title: string, msg: string) => {
    try {
        Alert.alert(title, 
        msg, 
        [{text: 'OK', onPress: () => console.log('OK Pressed')},]
        );
    } catch (e) {
        console.error(e);
    }
   

}