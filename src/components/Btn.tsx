// In App.js in a new project
import * as React from 'react';
import { useState } from 'react';
import { Text, Pressable, StyleSheet } from 'react-native'
import { colors } from '../theme/colors';

interface BtnProps {
  label?: string;
  onPress?: any;
  disabled?: boolean;
}

export const Btn = ({label, onPress, disabled}: BtnProps) => {
 
  return (
    <Pressable 
     
        style={({pressed}) => [
            styles.btn,
            {
                opacity: pressed ? 0.7 : 1,
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
      backgroundColor: colors.primary,
      padding:10,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:10,
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