// In App.js in a new project
import * as React from 'react';
import { Text, Pressable, StyleSheet, Image } from 'react-native'




export const Logo = ({size}: {size?: 'small' | null}) => {
 
  return (
    <Image  source={require('../assets/kassandra.png')} style={[styles.image,{width: size === 'small' ? 150 : 250,height:100}]} resizeMode='contain'/> 
  );
}

const styles = StyleSheet.create({
    image: {
      
      borderRadius:10,
      width:250
    },
   
});