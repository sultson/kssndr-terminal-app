import {Alert} from 'react-native';


export const createDisconnectedAlert = async  () => {
    try {
        Alert.alert('Device offline', 
        `Please connect the device to the Wifi network.`, 
        [{text: 'OK', onPress: () => console.log('OK Pressed')},]
        );
    } catch (e) {
        console.error(e);
    }
   

}