import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import getWorkingHeight from './ScreenHeight';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const UserMenu = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userInfo');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userInfo');
      setUser(null);
      alert('Successfully logged out!');
    } catch (err) {
      console.error('Error logging out:', err);
      alert('An error occurred while logging out.');
    }
  };

  const handleLogin = () => {
    router.push('./Login');
  };

  const handleUserInfoClick = () => {
    if (user) {
      router.push('/UserInfo'); 
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.rectangle}>
        {user ? (
          <View style={styles.userInfo}>
            <TouchableOpacity onPress={handleUserInfoClick}>
              <Text style={styles.welcomeText}>
                {user.name} {user.surname}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Odjava</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.LoginButton} onPress={handleLogin}>
            <Text style={styles.LoginText}>Ulogujte se</Text>
          </TouchableOpacity>
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'flex-end',
  },
  LoginButton: {
    justifyContent: 'center',
  },
  LoginText: {
    textDecorationLine: 'underline',
    fontSize: 18,
    marginRight: 10,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  welcomeText: {
    textDecorationLine: 'underline',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  logoutButton: {
    backgroundColor: 'red',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default UserMenu;
