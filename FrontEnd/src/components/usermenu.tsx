import React from 'react';
import { View, StyleSheet } from 'react-native';
import getWorkingHeight from './VisinaEkrana';


const UserMenu = () => {
  return (
    <View style={styles.container}>
      <View style={styles.rectangle} />
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
  },
});

export default UserMenu;
