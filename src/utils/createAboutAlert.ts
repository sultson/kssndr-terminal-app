import {Platform, Alert} from 'react-native';
import PsdkModule from './PsdkModule';


export const createAboutAlert = async  () => {
    try {
        const constants: any = Platform?.constants
        const p = await PsdkModule.getPsdkDeviceInformation();
        const paymentAppVersion = p?.paymentAppVersion || 'unknown'
        const paymentDeviceState = p?.paymentDeviceState || 'unknown'
        const serial: string = constants?.Serial
        const model: string = constants?.Model
        Alert.alert('About', 
        `Application version: 0.1 \nSerial number: ${serial} \nModel: ${model}\nPsdk version: ${paymentAppVersion}\nPayment device state: ${paymentDeviceState}`, 
        [{text: 'OK', onPress: () => console.log('OK Pressed')},]
        );
    } catch (e) {
        console.error(e);
    }
   

}