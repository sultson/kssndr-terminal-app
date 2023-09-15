import * as React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native'
import { useTheme } from '../theme/useTheme';

interface BtnSubtleProps {
  label?: string;
  onPress?: any;
}

export const BtnSubtle = ({label, onPress}: BtnSubtleProps) => {
  const theme = useTheme()
  return (
    <Pressable 
     
        style={({pressed}) => [
            styles.btn,
            {
                opacity: pressed ? 0.7 : 1,
            },
            
        ]}
        onPress={onPress}
    >
      <Text style={[styles.btnText, {color: theme.colors.secondary}]}>{label}</Text>
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
        textDecorationLine: 'underline',
    }
});