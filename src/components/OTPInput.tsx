import React, { useRef, useState, useEffect } from "react";
import { TextInput, Text, Pressable, View, StyleSheet } from "react-native";
import { useTheme } from "../theme/useTheme";

interface OTPInputProps {
  code: string;
  setCode: any;
  maximumLength: number;
  setIsPinReady: any;
}

const OTPInput = ({ code, setCode, maximumLength, setIsPinReady }: OTPInputProps) => {
  const boxArray = new Array(maximumLength).fill(0);
  const inputRef: any= useRef();
  const [isInputBoxFocused, setIsInputBoxFocused] = useState(false);
  const theme = useTheme()
  const handleOnPress = () => {
    setIsInputBoxFocused(true);
    inputRef?.current?.focus();
  };

  const handleOnBlur = () => {
    setIsInputBoxFocused(false);
  };

  useEffect(() => {
    // update pin ready status
    setIsPinReady(code.length === maximumLength);
    // clean up function
    return () => {
      setIsPinReady(false);
    };
  }, [code]);
  const boxDigit = (_: any, index: number) => {
    const emptyInput = "";
    const digit = code[index] || emptyInput;

    const isCurrentValue = index === code.length;
    const isLastValue = index === maximumLength - 1;
    const isCodeComplete = code.length === maximumLength;

    const isValueFocused = isCurrentValue || (isLastValue && isCodeComplete);


    return (
      <View key={index} style={[styles.boxDigit, {borderColor: isValueFocused ? theme.colors.accent : theme.colors.text, borderRadius: theme.borderRadius, backgroundColor: theme.colors.background}]}>
        <Text style={[styles.digit, {color: theme.colors.text}]}>{digit}</Text>
      </View>
    );
  };

  return (
    <View>
      <Pressable onPress={handleOnPress} style={styles.boxesContainer}>
        {boxArray.map(boxDigit)}
      </Pressable>
      <TextInput
        style={styles.textInputHidden}
        value={code}
        onChangeText={setCode}
        maxLength={maximumLength}
        ref={inputRef}
        onBlur={handleOnBlur}
        keyboardType='number-pad'
      />
    </View>
  );
};

export default OTPInput;

const styles = StyleSheet.create({
  image: {
    
    borderRadius:10,
    width:250
  },
  boxDigit: {
    borderWidth:2,
    width:'15%',
    height:60,
    justifyContent:'center',
    alignItems:'center',
  },
  digit: {
    fontSize:30,
  },
  boxesContainer: {
    flexDirection:'row',
    width: '80%',
    justifyContent:'space-evenly'
  },
  textInputHidden: {
    position: 'absolute',
    opacity: 0
  }
 
});