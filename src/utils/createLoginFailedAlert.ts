import {Alert} from 'react-native';


export const createLoginFailedAlert = (title: string, msg: string) => {
    try {

        Alert.alert(title, msg, 
        [], {cancelable: false}
        );
    } catch (e) {
        console.error(e);
    }
   

}