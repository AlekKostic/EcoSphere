import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import getWorkingHeight from '../components/ScreenHeight';
import { useRouter } from 'expo-router';

const Icon = ({ source, route }) => {
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
    width: '38%',
    height: getWorkingHeight() * 0.193,
    marginBottom: getWorkingHeight() * 0.02,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E9', // svetlo zelena pozadina
    borderRadius: 15, // zaobljeni rubovi za moderan izgled
    marginHorizontal: 20,
    shadowColor: '#000', // senka za ikone
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // za Android senke
  },
  image: {
    width: '100%', // Slika je 80% širine kontejnera za bolji padding
    height: '100%',
    borderRadius: 10, // zaokruživanje same slike
  },
});

export default Icon;
