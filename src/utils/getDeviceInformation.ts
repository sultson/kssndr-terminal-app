import {Platform } from 'react-native';
import { getBatteryLevel, getUniqueId, getLastUpdateTime, getSerialNumber} from 'react-native-device-info';
import PsdkModule from './PsdkModule';


export const getDeviceInformation = async  () => {
    try {
        const batteryLevel = await getBatteryLevel()
        const serialNumber = await getSerialNumber()
        const uniqueId = await getUniqueId()
        const lastUpdated = await getLastUpdateTime()
        const constants: any = Platform?.constants
        const p = await PsdkModule.getPsdkDeviceInformation();
        const paymentAppVersion = p?.paymentAppVersion || '3.57.0'
        const paymentDeviceState = p?.paymentDeviceState || 'unknown'
        const serial: string =  constants?.Serial === 'unknown' ? p?.logicalDeviceId ? p.logicalDeviceId : serialNumber : constants.Serial
        const model: string = constants?.Model

        console.log(p)

        const prettyBatteryLevel = Number(Number(batteryLevel)*100).toFixed(2) + '%'
        const prettyLastUpdated = new Date(lastUpdated);
        const data = {
            psdkVersion: paymentAppVersion,
            psdkState: paymentDeviceState,
            serial,
            model,
            batteryLevel: prettyBatteryLevel,
            uniqueId,
            lastUpdated: prettyLastUpdated
        }

        return {data, error: null}
        
        
    } catch (e) {
        console.error(e);
        return {data: null, error: e}
    }
   

}