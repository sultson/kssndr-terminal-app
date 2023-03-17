// In App.js in a new project
import * as React from 'react';
import { Text, StyleSheet } from 'react-native'


export const Title = ({...props}) => {
 
  return (
    <Text style={[styles.text]}>{props.children}</Text>
  );
}

const styles = StyleSheet.create({
    text: {
      color:'black',
      fontSize:30,
      fontWeight:'600'
    },
   
});