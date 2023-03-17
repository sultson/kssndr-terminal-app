import {Alert} from 'react-native';


export const createLoginFailedAlert = () => {
    try {

        Alert.alert('Login failed', 
        `Please restart the device by holding down the power button and selecting "Restart".\nContact Kassandra Support if restarting does not resolve the issue.`, 
        [], {cancelable: false}
        );
    } catch (e) {
        console.error(e);
    }
   

}