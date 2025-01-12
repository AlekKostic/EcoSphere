import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import getWorkingHeight from './VisinaEkrana';


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
