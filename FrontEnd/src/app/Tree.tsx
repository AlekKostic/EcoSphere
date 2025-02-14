import { View, Text, Dimensions, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';  
import BackNav from '../components/Backnav';
import BackNav2 from '../components/Backnavhome';

import { RouteProp, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

type RootStackParamList = {
  Tree: {
    poeni: number;
    userId: string | null;
  };
};

type RouteParams = RouteProp<RootStackParamList, 'Tree'>;

const Tree = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteParams>();
  const [dark, setDark] = useState(false);
  const treeRef = useRef<LottieView | null>(null);
  const barRef = useRef<LottieView | null>(null);

  const [prev, setPrev]=useState("")

  useEffect(() => {
    const state = navigation.getState();
    if(state===undefined)return
    if (state.routes.length > 1) {
      const previousRoute = state.routes[state.routes.length - 2];
      setPrev(previousRoute.name);
    }
  }, [navigation]);
  
  const userId = route.params?.userId ?? null;

  const [src, setSrc] = useState(require('../assets/lightTree.json'));
  const [toShow, setToShow] = useState(0);
  const [add, setAdd]=useState(0)
  const [toShow2, setToShow2] = useState(0);
  const [red, setRed] = useState(false);
  const [pstreak, setpStreak] = useState(0);
  const [streak, setStreak] = useState(0);

  const [poeni, setPoeni]=useState(0)
  const [ppoeni, setpPoeni]=useState(0)
  
  
  const config = require('../../config.json');
  const ip = config.ipAddress;
  let st = 0;

  const [loading, setLoading]=useState(false);
  const [error, setError]=useState("");

    useEffect(()=>{

      const getUser = async()=>{

        try{
          
          setError("")
          setLoading(true)
          const userResponse = await axios(`http://${ip}:8080/v1/api/${userId}`)

          if(userResponse.data.poslednjiPoeni)
            setpPoeni(userResponse.data.poslednjiPoeni)

          if(userResponse.data.poslednjiStreak)
            setpStreak(userResponse.data.poslednjiStreak)

          setStreak(userResponse.data.streak)
          setPoeni(userResponse.data.broj_bodova)

          showAnim({
            pstreak2: userResponse.data.poslednjiStreak ?? 0,
            streak2: userResponse.data.streak,
            poeni2: userResponse.data.broj_bodova,
            ppoeni2: userResponse.data.poslednjiPoeni ?? 0,
          });

          setLoading(false)
          setError("")

        }
        catch(error){
          setError("Došlo je do greške prilikom učitavanja stabla.")
          setLoading(false)
        }
      }

      getUser()

    }, [])

  useEffect(() => {
    const getMode = async () => {
      const storedMode = await AsyncStorage.getItem('darkMode');
      setDark(storedMode === 'true');
      setSrc(storedMode === 'true' ? require('../assets/darkTree.json') : require('../assets/lightTree.json'));
    };

    getMode();
  }, []);

  const showAnim = async({ pstreak2, streak2, poeni2, ppoeni2 }: { pstreak2: number, streak2: number, poeni2: number, ppoeni2: number }) => {

    if(pstreak2!==0 && streak2===0){
      setTimeout(()=>{setRed(true); setTimeout(()=>setRed(false),2000)},1500)
    }

    const r = await axios.get(`http://${ip}:8080/v1/api/uso/${userId}`)


    if(!r.data){
      const dod = Math.min(streak2, 10)
      poeni2+=dod;
      setAdd(dod)
      
      setPoeni(poeni2)


      await axios.put(`http://${ip}:8080/v1/api/bodovi`,{
        "user_id": userId,
        "broj_poena":dod
      })

      
      await axios.put(`http://${ip}:8080/v1/api/drvo/${userId}`)

    }

    const dstreak = (streak2 ?? 0) - (pstreak2 ?? 0);
    const dpoeni = (poeni2 ?? 0) - (ppoeni2 ?? 0); 
  
    saveChanges({ dstreak, dpoeni })

    


    if (poeni2==ppoeni2 && poeni2%100===0) {
      barRef.current?.play(1, 1);
      return
    }

    setToShow(ppoeni2 % 100 + (poeni2 - ppoeni2));
    setToShow2(Math.floor(ppoeni2 / 100));
    if(streak2===0 && pstreak2!==0){
      setTimeout(()=>{setpStreak(streak2)},1500)
    }else
      setpStreak(streak2)

    

  
    if ( ppoeni2 % 100 + (poeni2 - ppoeni2) >= 100) {

      treeRef.current?.play(0.88 * (ppoeni2 % 100), 88);
      barRef.current?.play(0.5 * (ppoeni2 % 100), 60);
  
      setTimeout(() => {
        const f = toShow % 100;
        setToShow((prev) => prev % 100);
        setToShow2(Math.floor(poeni2 / 100));
  
        treeRef.current?.play(88, (poeni2%100) * 0.88);
        barRef.current?.play(60, 0.5 * (poeni2%100 + 1));
  
      }, 2500); 
    } else {
      treeRef.current?.play(0.88 * (ppoeni2 % 100), 0.88 * (poeni2%100));
      barRef.current?.play(0.5 * (ppoeni2 % 100), 0.5 * (poeni2%100 +1));
    }
    
    

  };

  const saveChanges = async({dstreak, dpoeni}:{dstreak:number, dpoeni:number}) =>{

    try{
    const re = await axios.put(`http://${ip}:8080/v1/api/poeni`,{
      "user_id": userId,
      "delta": dpoeni
    })

    await axios.put(`http://${ip}:8080/v1/api/promena`,{
      "user_id": userId,
      "delta": dstreak
    })
  }catch(error){}
  }
  

  


  return (
    <>
      {prev !== "QuizPage" ? <BackNav /> : <BackNav2 />}
      <View style={{ flex: 1, backgroundColor: dark ? '#124460' : 'white' }}>
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
              <Text style={[styles.pointsText, { color: dark ? 'white' : '#124460' }]}>
                {toShow}/100
              </Text>
              <LottieView
                ref={barRef}
                source={require('../assets/load.json')}
                style={styles.loadAnimation}
                autoPlay={false}
                loop={false}
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
            <View style={{ alignItems: 'center', marginBottom: 10, flexDirection: 'row' }}>
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
                minWidth: 80
              }}>
                <FontAwesome6 name='fire' size={20} color={red ? 'red' : (dark ? '#124460' : 'white')} />
                <Text style={{
                  color: red ? 'red' : (dark ? '#124460' : 'white'),
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginLeft: 5,
                }}>
                  {pstreak}
                </Text>
              </View>
  
              <Text style={{
                color: red ? 'red' : (!dark ? '#124460' : 'white'),
                fontSize: 20,
                fontWeight: 'bold',
                marginLeft: 10,
              }}>
                {add !== 0 && "+" + add}
              </Text>
            </View>
          </View>
  
          <View style={{ marginLeft: 30 }}>
            <Text style={{ fontSize: 20, color: dark ? 'white' : '#124460' }}>
              Broj celih stabala: {toShow2}
            </Text>
          </View>
          <View style={{ marginLeft: 30 }}>
            <Text style={{ marginTop: 5, fontSize: 16, color: dark ? 'white' : '#124460' }}>
              Radite dnevne kvizove redovne i osvajajte poene!
            </Text>
          </View>
        </ScrollView>
        {/* Loading screen */}
        {loading && (
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10
          }}>
            <ActivityIndicator size="large" color={dark ? 'white' : '#6ac17f'} />
            <Text style={[{ color: dark ? 'white' : '#6ac17f', marginTop: 10, fontSize: 18 }]}>Učitavanje stabla...</Text>
          </View>
        )}
        {error !== "" && (
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10
          }}>
            <Text style={[{ color: dark ? 'white' : '#6ac17f', marginTop: 10, fontSize: 18 }]}>
              {error}
            </Text>
          </View>
        )}
      </View>
    </>
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
