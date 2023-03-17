// In App.js in a new project
import * as React from 'react';
import { useState } from 'react';
import { Text, Pressable, StyleSheet } from 'react-native'
import { colors } from '../theme/colors';

interface BtnSubtleProps {
  label?: string;
  onPress?: any;
}

export const BtnSubtle = ({label, onPress}: BtnSubtleProps) => {
 
  return (
    <Pressable 
     
        style={({pressed}) => [
            styles.btn,
            {
                opacity: pressed ? 0.7 : 1,
            },
            
        ]}
        onPress={onPress}
        //android_ripple={{ radius:30}}
    >
      <Text style={styles.btnText}>{label}</Text>
    </Pressable>   
  );
}

const styles = StyleSheet.create({
    btn: {
      backgroundColor: undefined,
      padding:10,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:10,
      paddingLeft: 30,
      paddingRight:30
    },
    btnText: {
        fontSize: 15,
        fontWeight:'600',
        color: 'gray',
        textDecorationLine: 'underline',
    }
});