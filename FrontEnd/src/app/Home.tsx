import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import UserMenu from '../components/usermenu';
import PictureSection from '../components/PictureSection';
import Icon from '../components/Icon';
import getWorkingHeight from '../components/ScreenHeight';
import { Link } from 'expo-router';

const Home = () => {
  const iconData = [
    { id: '1', source: require('../img/maps.png'), route: '/Map' },
    { id: '2', source: require('../img/education.png'), route: '/Education' },
    { id: '3', source: require('../img/DIY.png'), route: '/DIYIdeas' },
    { id: '4', source: require('../img/quiz.png'), route: '/QuizIntro' },
    { id: '5', source: require('../img/forum.png'), route: '/Forum' },
    { id: '6', source: require('../img/marketplace.png'), route: '/Marketplace' },
  ];

  useEffect(()=>{console.log(getWorkingHeight())}, [])

  return (
    <View style={styles.container}>
      <UserMenu />
      <PictureSection />
      
      <View style={styles.gridContainer}>
        {iconData.map((item) => (
            <Icon key={item.id.toString()} source={item.source} route={item.route} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? 20 : 0, 
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: getWorkingHeight() * 0.02, 
    marginLeft: 20,
    marginRight: 20,
  },
});

export default Home;
