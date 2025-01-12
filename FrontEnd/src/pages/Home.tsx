import React from 'react';
import { View, StyleSheet } from 'react-native';
import UserMenu from '../app/usermenu';
import PictureSection from '../app/PictureSection';
import Icon from '../app/Icon';

import getWorkingHeight from '../app/VisinaEkrana';

const Home = () => {
  const iconData = [
    { id: '1', source: require('../img/icon1.png') },
    { id: '2', source: require('../img/icon1.png') },
    { id: '3', source: require('../img/icon1.png') },
    { id: '4', source: require('../img/icon1.png') },
    { id: '5', source: require('../img/icon1.png') },
    { id: '6', source: require('../img/icon1.png') },
  ];

  return (
    <View style={styles.container}>
      <UserMenu />
      <PictureSection />
      
      <View style={styles.gridContainer}>
        {iconData.map((item) => (
          <Icon key={item.id} source={item.source} />
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
