import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import getWorkingHeight from './ScreenHeight';
import { useRouter } from 'expo-router';


const UserMenu = () => {

  const router = useRouter()

  const handleLogin = () =>
  {
     router.push('./Login')
  }

  return (
    <View style={styles.container}>
      <View style={styles.rectangle}>
        <TouchableOpacity style={styles.LoginButton} onPress={handleLogin}>
          <Text style={styles.LoginText}>Ulogujte se</Text>
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
    right: 0, 
  },LoginButton: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 'auto',
  },
  LoginText: {
    alignSelf: 'flex-end',
    paddingRight: 20,
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default UserMenu;
