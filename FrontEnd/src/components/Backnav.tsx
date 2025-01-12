import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import getWorkingHeight from './VisinaEkrana';

const BackNav = () => {
  const router = useRouter();  

  const handleBackPress = () => {
    router.push('/Home'); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.rectangle}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
  },
  rectangle: {
    height: getWorkingHeight() * 0.05, 
    backgroundColor: 'gray', 
    width: '100%', 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    justifyContent: 'center',
    alignItems: 'flex-start',  // Align text to the left
    paddingLeft: 15,  // Add some padding to the left side
  },
  backButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  backText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default BackNav;
