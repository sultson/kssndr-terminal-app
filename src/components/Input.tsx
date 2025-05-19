// In App.js in a new project
import * as React from 'react';
import { TextInput, StyleSheet } from 'react-native'
import { useTheme } from '../theme/useTheme';
import { hexToRGB } from '../utils/hexToRGB';
import { useState } from 'react';


export const Input = ({...props}) => {
  const theme = useTheme()
  const [borderColor, setBorderColor] = useState(hexToRGB(theme.colors.secondary,0.5))
  
  return (
    <TextInput
        {...props}
        style={[styles.input, {
          borderRadius: theme.borderRadius,
          borderColor,
          color: theme.colors.text,
          backgroundColor: theme.colors.background
        }]}

        placeholderTextColor={theme.colors.secondary}

        onFocus={() => setBorderColor(theme.colors.accent)}
        onBlur={() => setBorderColor(hexToRGB(theme.colors.secondary,0.5))}

    />
  );
}

const styles = StyleSheet.create({
    input: {
      borderWidth:1.5,
      width: 250,
      padding:10,
      fontWeight:'500',
      fontSize:16
    },
   
});