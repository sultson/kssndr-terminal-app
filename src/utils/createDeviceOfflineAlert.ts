import {Alert} from 'react-native';


export const createDeviceOfflineAlert = async  (title: string, msg: string) => {
    try {
        Alert.alert('Device offline', 
        `Please connect the device to the Wifi network.`, 
        [{text: 'OK', onPress: () => console.log('OK Pressed')},]
        );
    } catch (e) {
        console.error(e);
    }
   

}