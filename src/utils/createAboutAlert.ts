import { Alert } from 'react-native';
import { getDeviceInformation } from './getDeviceInformation';


export const createAboutAlert = async  () => {
    try {
        const i = await getDeviceInformation()
        if (i?.error || !i?.data) throw i.error
        Alert.alert('About', 
        `Application version: 1.1 \nSerial number: ${i.data?.serial} \nModel: ${i.data?.model}\nPsdk version: ${i.data?.psdkVersion}\nPayment device state: ${i.data?.psdkState}\nUnique id: ${i.data?.uniqueId}\nLast updated: ${i.data?.lastUpdated}`, 
        [{text: 'OK', onPress: () => console.log('OK Pressed')},]
        );
    } catch (e) {
        console.error(e);
    }
   
}