import React from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableHighlight } from 'react-native';
import UserMenu from '../components/usermenu';
import PictureSection from '../components/PictureSection';
import Icon from '../components/Icon';

import getWorkingHeight from '../components/VisinaEkrana';
import { Link } from 'expo-router';

const Home = () => {
  const iconData = [
    { id: '1', source: require('../img/icon1.png'), route: '/icon1' },
    { id: '2', source: require('../img/icon2.png'), route: '/icon2' },
    { id: '3', source: require('../img/icon3.png'), route: '/icon3' },
    { id: '4', source: require('../img/icon4.png'), route: '/icon4' },
    { id: '5', source: require('../img/icon5.png'), route: '/icon5' },
    { id: '6', source: require('../img/icon6.png'), route: '/icon6' },
  ];

  return (
    <View style={styles.container}>
      <UserMenu />
      <PictureSection />
      
      <View style={styles.gridContainer}>
        {iconData.map((item) => (
            <Icon source={item.source} route={item.route} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: getWorkingHeight() * 0.02, 
  },
});

export default Home;