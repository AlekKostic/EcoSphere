import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import getWorkingHeight from '../components/ScreenHeight';
import { useRouter } from 'expo-router';

const Icon = ({source, route }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(route); 
  };

  return (
    <TouchableOpacity style={styles.iconContainer} onPress={handlePress}> 
      <Image source={source} style={styles.image} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: '40%',
    height: getWorkingHeight() * 0.193, 
    marginBottom: getWorkingHeight() * 0.02,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: '100%', 
    borderRadius: 10,
  },
});

export default Icon;
