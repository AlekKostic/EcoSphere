import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Slot } from 'expo-router'; // Koristi Slot za učitavanje rute

// Ovo je osnovna struktura za globalni layout
export default function Layout() {
  return (
      <Slot /> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    height: 50,
    backgroundColor: '#4CAF50',
    color: 'white',
    textAlign: 'center',
    paddingVertical: 15,
  },
  footer: {
    height: 30,
    backgroundColor: '#333',
    color: 'white',
    textAlign: 'center',
    paddingVertical: 5,
  },
});
