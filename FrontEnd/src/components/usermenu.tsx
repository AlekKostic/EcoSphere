import React, { useEffect, useState } from 'react'; 
import { View, StyleSheet, Text, TouchableOpacity, Animated, Platform } from 'react-native'; 
import getWorkingHeight from './ScreenHeight'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { useRouter } from 'expo-router'; 
import { Feather } from '@expo/vector-icons';

const UserMenu = ({ setDarkMode2 }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const toggleAnim = new Animated.Value(darkMode ? 1 : 0); 

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

    const fetchDarkMode = async () => {
      try {
        const storedMode = await AsyncStorage.getItem('darkMode');
        if (storedMode !== null) {
          const mode = JSON.parse(storedMode);
          setDarkMode(mode);
          setDarkMode2(mode); 
        } else {
          setDarkMode(false);
          setDarkMode2(false); 
          await AsyncStorage.setItem('darkMode', JSON.stringify(false)); 
        }
      } catch (err) {
        console.error('Error fetching dark mode:', err);
      }
    };

    fetchUserInfo();
    fetchDarkMode();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userInfo');
      await AsyncStorage.removeItem('treeVisits');
      setUser(null);
    } catch (err) {
      alert('Error logging out.');
    }
  };

  const handleLogin = () => {
    router.push('./Login');
  };

  const handleUserInfoClick = async () => {
    const userInfo = await AsyncStorage.getItem('userInfo');
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);
      const userId = parsedUserInfo.userId;
      router.push({
        pathname: '/UserInfo',
        params: { id: userId },
      });
    }
  };

  const toggleDarkMode = async () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    setDarkMode2(newMode);
    await AsyncStorage.setItem('darkMode', JSON.stringify(newMode));

    Animated.timing(toggleAnim, {
      toValue: newMode ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={[styles.container, darkMode ? styles.containerDark : styles.containerLight]}>
      <View style={styles.rectangle}>
        <TouchableOpacity onPress={toggleDarkMode} style={styles.toggleWrapper}>
          <Animated.View 
            style={[ 
              styles.toggleBackground, 
              { backgroundColor: toggleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['#124460', 'white'] 
                })
              }
            ]}
          />
          <Animated.View
  style={[ 
    styles.toggleCircle, 
    { 
      backgroundColor: !darkMode ? '#124460' : 'white', 
      transform: [
        {
          translateX: toggleAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 28],
          })
        }
      ]
    }
  ]}
>
  <Animated.View 
    style={[ 
      styles.iconWrapper,
      { opacity: toggleAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }
    ]}
  >
    <Feather name="sun" size={20} color="white" />
  </Animated.View>
  <Animated.View 
    style={[ 
      styles.iconWrapper, 
      { opacity: toggleAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }) }
    ]}
  >
    <Feather name="moon" size={20} color="#124460" />
  </Animated.View>
</Animated.View>
        </TouchableOpacity>

        {user ? (
          <View style={styles.userInfo}>
            <TouchableOpacity onPress={handleUserInfoClick}>
              <Text style={[styles.welcomeText, darkMode ? styles.welcomeTextDark : styles.welcomeTextLight]}>
                {user.name} {user.surname}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Odjava</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.LoginButton} onPress={handleLogin}>
            <Text style={[styles.LoginText, darkMode ? styles.LoginTextDark : styles.LoginTextLight]}>
              Ulogujte se
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 0,
    marginTop: Platform.OS === 'android' ? '5%' : '3%',
  },
  containerLight: {
    backgroundColor: 'white',
  },
  containerDark: {
    backgroundColor: '#124460',
  },
  rectangle: {
    height: getWorkingHeight() * 0.05,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  toggleWrapper: {
    width: 60,
    height: 30,
    borderRadius: 20,
    justifyContent: 'center',
    position: 'relative',
  },
  toggleBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  toggleCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    left: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    position: 'absolute',
  },
  LoginButton: {
    justifyContent: 'center',
  },
  LoginText: {
    textDecorationLine: 'underline',
    fontSize: 18,
    marginRight: 10,
    color: '#124460', 
    fontWeight: 'bold',
    textAlign: 'left',
  },
  LoginTextDark: {
    color: 'white', 
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  welcomeText: {
    textDecorationLine: 'underline',
    color: '#124460',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  welcomeTextDark: {
    color: 'white', 
  },
  welcomeTextLight: {
    color: '#124460', 
  },
  logoutButton: {
    backgroundColor: '#9a2626',
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
