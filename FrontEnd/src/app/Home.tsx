import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, StatusBar, Text, AppState, SafeAreaView } from 'react-native';
import UserMenu from '../components/usermenu';
import PictureSection from '../components/PictureSection';
import Icon from '../components/Icon';
import getWorkingHeight from '../components/ScreenHeight';
import { Link } from 'expo-router';

const Home = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('default'); 
    } else {
      StatusBar.setBarStyle(darkMode ? 'light-content' : 'dark-content'); 
      StatusBar.setBackgroundColor(darkMode ? '#124460' : '#fff'); 
    }

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        if (Platform.OS === 'ios') {
          StatusBar.setBarStyle('default'); 
        } else {
          StatusBar.setBarStyle(darkMode ? 'light-content' : 'dark-content');
          StatusBar.setBackgroundColor(darkMode ? '#124460' : '#fff');
        }
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove(); 
    };
  }, [appState, darkMode]);

  const iconData = [
    { id: '1', source: !darkMode?require('../img/lightMap.png'):require('../img/darkMap.png'), route: '/Map' },
    { id: '2', source: !darkMode?require('../img/lightE.png'):require('../img/darkE.png'), route: '/Education' },
    { id: '3', source: !darkMode?require('../img/lightDIY.png'):require('../img/darkDIY.png'), route: '/DIYIdeas' },
    { id: '4', source: !darkMode?require('../img/lightQuiz.png'):require('../img/darkQuiz.png'), route: '/QuizIntro' },
    { id: '5', source: !darkMode?require('../img/lightForum.png'):require('../img/darkForum.png'), route: '/Forum' },
    { id: '6', source: !darkMode?require('../img/lightMarket.png'):require('../img/darkMarket.png'), route: '/Marketplace' },
  ];

  return (
    <SafeAreaView style={darkMode ? styles.darkModeContainer : styles.lightModeContainer}>
      <UserMenu setDarkMode2={setDarkMode} />
      <PictureSection darkMode={darkMode}/>

      <View style={styles.gridContainer}>
        {iconData.map((item) => (
          <Icon key={item.id.toString()} source={item.source} route={item.route} />
        ))}
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? 20 : 0,
  },
  darkModeContainer: {
    backgroundColor: '#124460',
  },
  lightModeContainer: {
    backgroundColor: '#fff',
  },
  gridContainer: {
    height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: getWorkingHeight() * 0.02,
    marginLeft: 20,
    marginRight: 20,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.6, 
    shadowRadius: 3, 
    elevation: 5, 
  },
});


export default Home;