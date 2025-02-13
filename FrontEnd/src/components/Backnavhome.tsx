import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BackNav = () => {
  const router = useRouter();

  const handleBack = () => {
    router.push('/Home')
  };

  const [dark, setDark]=useState(false)

  const getMode =async()=>{

    const storedMode = await AsyncStorage.getItem('darkMode');

    if(storedMode==="true")setDark(true)

  }

  useEffect(()=>{getMode()},[])

  return (
    <TouchableOpacity onPress={handleBack} style={[styles.container, dark ? styles.containerdark : styles.containerlight]}>
      <Text style={[styles.backbtn, dark ? styles.btndark : styles.btnlight]}>Nazad</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    textAlignVertical: 'center',
    borderBottomWidth: 2,
    paddingTop:10,
  },
  containerdark:{
    backgroundColor: '#124460',
    borderBottomColor: 'white',
  },
  containerlight:{
    backgroundColor: 'white',
    borderBottomColor: '#124460'
  },
  backbtn: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'right',
    paddingRight: 24,
    paddingTop: 12,
    paddingBottom: 12,
    letterSpacing: 0.15,
    textAlignVertical: 'center',
  },btndark:{
    
    color: 'white',
  },
  btnlight:{
    
    color: '#124460',
  },
});

export default BackNav;
