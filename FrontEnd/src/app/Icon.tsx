import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

const Icon = ({ source }) => {
  return (
    <View style={styles.iconContainer}>
      <Image source={source} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: '45%',
    height: height * 0.183, 
    marginBottom: height * 0.03, 
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
