// In App.js in a new project
import * as React from 'react';
import { StyleSheet, Image } from 'react-native'
import { useTheme } from '../theme/useTheme';
import { memo } from 'react';


const areEqual = () => {


  return true;
};

export const Logo = memo(({size}: {size?: 'small' | null}) => {
  const theme = useTheme()
  console.log('logo render')
  return (
    <Image  source={theme.logo || require('../assets/kassandra.png')} style={[styles.image,{width: size === 'small' ? 150 : 250,height:100}]} resizeMode='contain'/> 
  );
}, areEqual)




const styles = StyleSheet.create({
    image: {
      
      borderRadius:10,
      width:250
    },
   
});

