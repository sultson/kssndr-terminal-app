// In App.js in a new project
import * as React from 'react';
import { TextInput, StyleSheet } from 'react-native'


export const Input = ({...props}) => {
 
  return (
    <TextInput
        {...props}
        style={styles.input}
    />
  );
}

const styles = StyleSheet.create({
    input: {
      borderWidth:1,
      borderColor:'black',
      backgroundColor:'white',
      borderRadius:10,
      width: 250,
      padding:10,
      fontWeight:'700'
    },
   
});