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
    height: getWorkingHeight() * 0.18,
    marginBottom: getWorkingHeight() * 0.02,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    borderRadius:10,
    elevation: 3,
  },
  iconContainerLight: {
    backgroundColor: 'black',
    elevation: 5, 
  },
  iconContainerDark:{
    backgroundColor: '#124460',
    elevation: 5, 
  },
  image: {
    width: '100%', 
    height: '100%',
    borderRadius: 10,
  },
});

export default Icon;
