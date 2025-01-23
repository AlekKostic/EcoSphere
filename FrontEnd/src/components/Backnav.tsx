import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import getWorkingHeight from './ScreenHeight';

const BackNav = () => {
  const router = useRouter();  

  const handleBack = () => {
    router.push('/Home'); 
  };

  return (
    <TouchableOpacity onPress={handleBack} style={styles.container}>
      <Text style={styles.backbtn}>Nazad</Text>
    </TouchableOpacity>
  );
};



const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    textAlignVertical: 'center',
    borderBottomColor: 'white',
    borderBottomWidth: 2,
  },
  backbtn: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
    textAlign: 'right',
    paddingRight: 24,
    paddingTop: 12,
    paddingBottom: 12,
    letterSpacing: 0.15,
    textAlignVertical: 'center',
  },
});

export default BackNav;
