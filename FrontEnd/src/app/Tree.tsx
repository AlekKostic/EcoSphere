import { View, Text, Dimensions, ScrollView, StyleSheet } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';  
import BackNav from '../components/Backnav';
import { useRoute } from '@react-navigation/native';

const Tree = () => {
  const route = useRoute();
  const [dark, setDark] = useState(false);
  const treeRef = useRef(null);
  const barRef = useRef(null);
  const poeni = route.params?.poeni ?? 0;
  const poeni2 = poeni % 100;
  const [src, setSrc] = useState(require('../assets/lightTree.json'));
  const { width, height } = Dimensions.get('window');
  const [toShow, setToShow]=useState(0);
  const [toShow2, setToShow2]=useState(0);

  const [visits, setVisits] = useState(0);
  const prevVisitsRef = useRef(visits); // Čuvamo prethodnu vrednost visits

  useEffect(() => {
    const getTreeVisits = async () => {
      try {
        const storedVisits = await AsyncStorage.getItem('treeVisits');
        const parsedVisits = storedVisits !== null ? parseInt(storedVisits, 10) : 0;
        setVisits(parsedVisits);

        setToShow(visits % 100 + (poeni - visits));
        setToShow2(Math.floor(visits/100));

        

        await AsyncStorage.setItem('treeVisits', poeni.toString());
      } catch (error) {
        console.error('Error fetching tree visits:', error);
      }
    };

    getTreeVisits();
  }, []);

  useEffect(() => {
    if (!treeRef.current || !barRef.current) return;
  
    if (prevVisitsRef.current === visits) return;
    prevVisitsRef.current = visits;
    setToShow(visits % 100 + (poeni - visits));
    setToShow2(Math.floor(visits/100));
  
    treeRef.current.reset();
    barRef.current.reset();
  
    console.log("useEffect triggered:", { visits, poeni });
  
    if (visits % 100 + (poeni - visits) >= 100) {
      console.log("🎬 Prva animacija start");
      treeRef.current.play(0.88 * (visits % 100), 88);
      barRef.current.play(0.6 * (visits % 100), 60);
  
      setTimeout(() => {
        console.log("🎬 Druga animacija start");
        console.log(toShow)
        setToShow(prev=>prev%100)
        setToShow2(Math.floor(poeni/100));
        
        treeRef.current.play(0.88 * poeni, 0);
        barRef.current.play(0.5 * poeni2, 0);
  
        setTimeout(() => {
          console.log("🎬 Treća animacija start");
          treeRef.current.play(0, 0.88 * poeni2);
          barRef.current.play(0, 0.5 * poeni2);
        }, 3000); 
      }, 2500); 
    } else {
      console.log("🎬 Neposredno pokretanje treće animacije");
      treeRef.current.play(0.88 * (visits % 100), 0.88 * poeni2);
      barRef.current.play(0.5 * (visits % 100), 0.5 * poeni2);
    }
  }, [visits]);
  
  
  

  useEffect(() => {
    const getMode = async () => {
      const storedMode = await AsyncStorage.getItem('darkMode');
      setDark(storedMode === 'true');
      setSrc(storedMode === 'true' ? require('../assets/darkTree.json') : require('../assets/lightTree.json'));
    };

    getMode();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: dark ? '#124460' : 'white' }}>
      <BackNav />
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <View style={styles.animationWrapper}>
            <LottieView 
              key={dark ? 'dark' : 'light'} 
              ref={treeRef}
              source={src} 
              style={styles.animation}
              autoPlay={false}  
              loop={false}    
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.cropBar}>
            <Text style={[styles.pointsText, { color: dark ? 'white' : '#124460' }]}>{toShow}/100</Text>
            <LottieView 
              ref={barRef}
              source={require('../assets/load.json')} 
              style={styles.loadAnimation} 
              autoPlay={false}  
              loop={false}
            />
          </View>
        </View>
        <View style={{ marginLeft: 30 }}>
          <Text style={{ fontSize: 20, color: dark ? 'white' : '#124460' }}>
            Broj celih stabala: {toShow2}
          </Text>
        </View>
        <View style={{ marginLeft: 30 }}>
          <Text style={{ marginTop: 5, fontSize: 15, color: dark ? 'white' : '#124460' }}>
            Radite dnevne kvizove i osvajajte poene!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  animationWrapper: {
    width: '80%',
    height: 300,
    overflow: 'hidden', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation: {
    width: '100%', 
    height: '100%', 
    resizeMode: 'contain',
  },
  cropBar: {
    marginLeft: '20%',
    width: '60%',
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    alignSelf: 'center',
    flexDirection: 'row', 
  },
  loadAnimation: {
    width: '80%',  
    height: '100%', 
    resizeMode: 'contain',
  },
  pointsText: {
    fontSize: 18,
    bottom: 2,
    fontWeight: '500',
    color: 'black',
    textAlign: 'center',
  }
});

export default Tree;
