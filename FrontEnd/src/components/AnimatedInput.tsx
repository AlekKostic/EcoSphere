import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, Animated, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';

const AnimatedInputField = ({ label, value, onChangeText, isPassword = false, dark }) => {
  const [isFocused, setIsFocused] = useState(false);
  const labelAnim = useRef(new Animated.Value(0)).current;
  const inputWidth = useRef(new Animated.Value(0)).current;
  const inputRef = useRef(null); 

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    Animated.timing(inputWidth, {
      toValue: isFocused ? 50 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    top: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [15, -10],
    }),
    fontSize: labelAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [18, 14],
    }),
    color: '#124460',
  };

  const inputStyle = isFocused
    ? [styles.input, styles.inputFocused, {borderColor: dark?'white':'#124460',}]
    : styles.input;

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={[styles.inputContainer, {borderBottomColor: dark?'white':'#124460', borderBottomWidth: isFocused ? 0 : 1 }]}>
      <Animated.Text style={[styles.label, labelStyle, {color: dark?'white':'#124460',}]}>{label}</Animated.Text>
      
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
        <TextInput
          ref={inputRef}
          style={[inputStyle, {color: dark?'white': '#124460'}]}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={(label==="Lozinka" ? !showPassword : false)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </TouchableWithoutFeedback>

      {((label === "Lozinka") || (value!=="" && label === "Lozinka")) && (
        <TouchableOpacity onPress={toggleShowPassword}>
          <MaterialCommunityIcons
            name={showPassword ? 'eye' : 'eye-off'}
            size={24}
            color={dark?'white':'#124460'}
            style={[styles.eyeIcon, {top:-7}]}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  inputContainer: {
    marginBottom: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    fontSize:15,
  },
  label: {
    position: 'absolute',
    left:5,
  },
  inputWrapper: {
    marginTop: 10,
  },
  input: {
    fontSize: 16,
    color: '#124460',
    paddingVertical: 5,
    paddingLeft: 10,
    flex: 1,
  },
  inputFocused: {
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    borderWidth: 1,
    marginTop:5,
  },
  loginButton: {
    backgroundColor: '#6ac17f',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  loginText: {
    fontSize: 18,
    color: '#124460',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
  },
});

export default AnimatedInputField;
