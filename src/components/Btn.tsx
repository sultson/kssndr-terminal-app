import * as React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native'
import { useTheme } from '../theme/useTheme';
import { hexToRGB } from '../utils/hexToRGB';

interface BtnProps {
  label?: string;
  onPress?: any;
  disabled?: boolean;
}

export const Btn = ({label, onPress, disabled}: BtnProps) => {
  const theme = useTheme()
  return (
    <Pressable 
     
        style={({pressed}) => [
            styles.btn,
            {
                opacity: pressed ? 0.7 : 1,
                backgroundColor: theme.colors.accent,
                borderRadius: theme.borderRadius,
                //elevation:1,
                borderWidth:1.5,
                borderColor:hexToRGB(theme.colors.accent,0.7)

            },
            
        ]}
        onPress={onPress}
        android_ripple={{ radius:10}}
        disabled={disabled}
    >
      <Text style={styles.btnText}>{label}</Text>
    </Pressable>   
  );
}

const styles = StyleSheet.create({
    btn: {
      padding:10,
      justifyContent:'center',
      alignItems:'center',
      paddingLeft: 30,
      paddingRight:30,
      margin:10
    },
    btnText: {
        fontSize: 20,
        color:'white',
        fontWeight:'700'
    }
});