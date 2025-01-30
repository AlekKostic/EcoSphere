import React from 'react';
import { View, StyleSheet, Image, Platform } from 'react-native';
import getWorkingHeight from './ScreenHeight';

const PictureSection = ({ darkMode }) => {
  return (
    <View style={styles.pictureSection}>
      <Image
        source={darkMode ? require('../img/darkHero.png') : require('../img/lightHero.png')} 
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pictureSection: {
    height: getWorkingHeight() * 0.27,
    width: '100%',
    backgroundColor: '#f0f0f0',
    marginTop: Platform.OS === 'android' ? getWorkingHeight() * 0.05 : getWorkingHeight() * 0.05,  // Adjusting the top margin dynamically
  },
  image: {
    width: '100%', 
    height: '100%', 
  },
});

export default PictureSection;
