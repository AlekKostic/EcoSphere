import { View, Text, Dimensions, ScrollView, StyleSheet } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';  
import BackNav from '../components/Backnav';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { FontAwesome6 } from '@expo/vector-icons';

const Tree = () => {
  const route = useRoute();
  const [dark, setDark] = useState(false);
  const treeRef = useRef(null);
  const barRef = useRef(null);
  const streakRef = useRef(0); // Koristimo ref za čuvanje vrednosti streak
  const poeni = route.params?.poeni ?? 0;
  const userId = route.params?.userId ?? null;
  const poeni2 = poeni % 100;
  const [src, setSrc] = useState(require('../assets/lightTree.json'));
  const { width, height } = Dimensions.get('window');
  const [pstreak, setpStreak] = useState(0);
  const [streak, setStreak] = useState(0);
  const [show, setShow] = useState(false);
  const [toShow, setToShow] = useState(0);
  const [toShow2, setToShow2] = useState(0);
  const [red, setRed] = useState(false);
  const [visits, setVisits] = useState(0);
  const prevVisitsRef = useRef(visits); // Čuvamo prethodnu vrednost visits
  const config = require('../../config.json');
  const ip = config.ipAddress;
  let st = 0;

  useEffect(() => {
    const getTreeVisits = async () => {
      try {
        const storedVisits = await AsyncStorage.getItem('treeVisits');
        const parsedVisits = storedVisits !== null ? parseInt(storedVisits, 10) : 0;
    
        
    
        setVisits(parsedVisits);

    
        setToShow(visits % 100 + (poeni - visits));
        setToShow2(Math.floor(visits / 100));
    
        const response = await axios.get(`http://${ip}:8080/v1/api/${userId}`);
        console.log(response.data);
    
        if (response.data.radjen) {
          await axios.put(`http://${ip}:8080/v1/api/unstreak/${userId}`);
        }
    
        const streakk = response.data.streak;
        streakRef.current = streakk; // Ažuriramo ref sa vrednošću streak
        setStreak(streakk);
        st = streakk;
    
        console.log(pstreak + " ttt " + streak);
    
        await AsyncStorage.setItem('streak', streakk.toString());
        await AsyncStorage.setItem('treeVisits', poeni.toString());
      } catch (error) {
        console.error('Error fetching tree visits:', error);
      }
    };
  
    getTreeVisits();
  }, [poeni, visits]);
  
  useEffect(() => {
    if (!treeRef.current || !barRef.current) return;
  
    if (prevVisitsRef.current === visits) return;
  
    if (visits === 0) {
      barRef.current.play(0, 0);
    }
  
    console.log(pstreak + " aaaaa" + streak);
  
    prevVisitsRef.current = visits;
    setToShow(visits % 100 + (poeni - visits));
    setToShow2(Math.floor(visits / 100));
  
    treeRef.current.reset();
    barRef.current.reset();
  
    if (visits % 100 + (poeni - visits) >= 100) {
      console.log("🎬 Prva animacija start");
      treeRef.current.play(0.88 * (visits % 100), 88);
      barRef.current.play(0.5 * (visits % 100), 60);
  
      setTimeout(() => {
        console.log("🎬 Druga animacija start");
        const f = toShow % 100;
        setToShow((prev) => prev % 100);
        setToShow2(Math.floor(poeni / 100));
  
        treeRef.current.play(88, f * 0.88);
        barRef.current.play(60, 0.5 * f + 1);
  
      }, 2500); // Čekamo da se prva animacija završi pre druge
    } else {
      console.log("🎬 Neposredno pokretanje treće animacije");
      treeRef.current.play(0.88 * (visits % 100), 0.88 * poeni2);
      barRef.current.play(0.5 * (visits % 100), 0.5 * poeni2 + 1);
  
    }
  }, [visits, streak]);
  
  
  useEffect(() => {
    
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
        <View style={{ alignItems: 'center', marginBottom: 10 }}>
          <View style={{
            backgroundColor: dark ? '#6ac17f' : '#6ac17f',
            paddingHorizontal: 20,
            paddingVertical: 5,
            borderTopLeftRadius: 50,
            borderBottomLeftRadius: 50,
            borderTopRightRadius: 50,
            borderBottomRightRadius: 50,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: 80, 
          }}>
            <FontAwesome6 name='fire' size={20} color={red ? 'red' : (dark?'#124460':'white')} />
            <Text style={{
              color: red ? 'red' : (dark ? '#124460' : 'white'),
              fontSize: 20,
              fontWeight: 'bold',
              marginLeft: 5,
            }}>
              {show ? streakRef.current : pstreak}
            </Text>
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
          <Text>{streak + " " + pstreak}</Text>
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
