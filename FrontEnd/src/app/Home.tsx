import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import UserMenu from '../components/usermenu';
import PictureSection from '../components/PictureSection';
import Icon from '../components/Icon';
import getWorkingHeight from '../components/ScreenHeight';

const Home = () => {
  const [darkMode, setDarkMode] = useState(false);

  const iconData = [
    { id: '1', source: !darkMode ? require('../img/lightMap.png') : require('../img/darkMap.png'), route: '/Map' },
    { id: '2', source: !darkMode ? require('../img/lightE.png') : require('../img/darkE.png'), route: '/Education' },
    { id: '3', source: !darkMode ? require('../img/lightDIY.png') : require('../img/darkDIY.png'), route: '/DIYIdeas' },
    { id: '4', source: !darkMode ? require('../img/lightQuiz.png') : require('../img/darkQuiz.png'), route: '/QuizIntro' },
    { id: '5', source: !darkMode ? require('../img/lightForum.png') : require('../img/darkForum.png'), route: '/Forum' },
    { id: '6', source: !darkMode ? require('../img/lightMarket.png') : require('../img/darkMarket.png'), route: '/Marketplace' },
  ];

  return (
    <View style={darkMode ? styles.darkModeContainer : styles.lightModeContainer}>
      <UserMenu setDarkMode2={setDarkMode} />
      <PictureSection darkMode={darkMode} />

      <View style={styles.gridContainer}>
        {iconData.map((item) => (
          <Icon key={item.id.toString()} source={item.source} route={item.route} />
        ))}
      </View>

      <View style={[styles.footer, {backgroundColor: darkMode?'#124460':'white'}]}>
        <Text></Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? 20 : 0,
  },
  darkModeContainer: {
    backgroundColor: '#124460',
    flex: 1,
    justifyContent: 'space-between', 
  },
  lightModeContainer: {
    backgroundColor: '#fff',
    flex: 1, 
    justifyContent: 'space-between',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: getWorkingHeight() * 0.02,
    marginLeft: 20,
    marginRight: 20,
  },
  footer: {
    backgroundColor: '#124460',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});

export default Home;
