import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import getWorkingHeight from '../components/ScreenHeight';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Icon = ({ source, route }) => {
  const [dark, setDark] = useState(false);
  const router = useRouter();

  const getMode = async () => {
    const storedMode = await AsyncStorage.getItem('darkMode');
    if (storedMode === "true") {
      setDark(true);
    } else {
      setDark(false);
    }
  };

  useEffect(() => {
    getMode();
  }, []);

  const handlePress = () => {
    router.push(route);
  };

  return (
    <TouchableOpacity
      style={[
        styles.iconContainer,
        dark ? styles.iconContainerDark : styles.iconContainerLight
      ]}
      onPress={handlePress}
    >
      <Image source={source} style={styles.image} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: '38%',
    height: getWorkingHeight() * 0.193,
    marginBottom: getWorkingHeight() * 0.02,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  iconContainerLight: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3, 
  },
  iconContainerDark: {
    shadowColor: 'black', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%', 
    height: '100%',
    borderRadius: 10,
  },
});

export default Icon;
