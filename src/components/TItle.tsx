// In App.js in a new project
import * as React from 'react';
import { Text, StyleSheet } from 'react-native'
import { useBoundStore } from '../store/useBoundStore';
import { useTheme } from '../theme/useTheme';


export const Title = ({...props}) => {
  const theme = useTheme()
  return (
    <Text style={[styles.text, {color: theme.colors.text}]}>{props.children}</Text>
  );
}

const styles = StyleSheet.create({
    text: {
      fontSize:30,
      fontWeight:'600'
    },
   
});