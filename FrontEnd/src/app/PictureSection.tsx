import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

const PictureSection = () => {
  return (
    <View style={styles.pictureSection}>
      <Image
        source={require('../img/hero.png')} 
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pictureSection: {
    height: height * 0.27,
    width: '100%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height*0.05,
  },
  image: {
    width: '100%', 
    height: '100%', 
  },
});

export default PictureSection;
