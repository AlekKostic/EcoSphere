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
  const poeni = route.params?.poeni?? 0;
  const poeni2 = poeni%100;
  const [p, setP]= useState(poeni2)
  const [src, setSrc] = useState(require('../assets/lightTree.json'));

  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    const getMode = async () => {
      const storedMode = await AsyncStorage.getItem('darkMode');
      setDark(storedMode === 'true');
      if (storedMode === 'true') {
        setSrc(require('../assets/darkTree.json'));
      } else {
        setSrc(require('../assets/lightTree.json'));
      }

      treeRef.current?.reset();
      barRef.current?.reset();

      if (poeni2 > 0 && poeni2 <= 10) {
        treeRef.current?.play(0, 4);
        barRef.current?.play(0, 6); 
      } else if (poeni2 > 10 && poeni2 <= 20) {
        treeRef.current?.play(0, 13);
        barRef.current?.play(0, 10); 
      } else if (poeni2 > 20 && poeni2 <= 30) {
        treeRef.current?.play(0, 18);
        barRef.current?.play(0, 15); 
      } else if (poeni2 > 30 && poeni2 <= 40) {
        treeRef.current?.play(0, 24);
        barRef.current?.play(0, 20); 
      } else if (poeni2 > 40 && poeni2 <= 50) {
        treeRef.current?.play(0, 30);
        barRef.current?.play(0, 25); 
      } else if (poeni2 > 50 && poeni2 <= 60) {
        treeRef.current?.play(0, 38);
        barRef.current?.play(0, 30);
      } else if (poeni2 > 60 && poeni2 <= 70) {
        treeRef.current?.play(0, 43);
        barRef.current?.play(0, 45); 
      } else if (poeni2 > 70 && poeni2 <= 80) {
        treeRef.current?.play(0, 51);
        barRef.current?.play(0, 40); 
      } else if (poeni2 > 80 && poeni2 <= 90) {
        treeRef.current?.play(0, 63);
        barRef.current?.play(0, 45); 
      } else if (poeni2 > 90 && poeni2 < 100) {
        treeRef.current?.play(0, 68);
        barRef.current?.play(0, 50); 
      } else if(poeni2>=100){
        treeRef.current?.play(0, 88);
        barRef.current?.play(0, 60); 
        setTimeout(() => {
            barRef.current?.play(60, 0); 
            treeRef.current?.play(88, 0); 
            
            setTimeout(() => {
            }, 4000);
          }, 4000);
      }
    };
    getMode();
  }, [poeni2, dark]);

  return (
    <View style={{ flex: 1, backgroundColor: dark ? '#124460' : 'white'  }}>
        
      <BackNav />
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent:'center'}}>

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
        <View style={[{flexDirection:'row'}]}>
        <View style={styles.cropBar}>
            
        <Text style={[styles.pointsText, {color:dark?'white':'#124460'}]}>{poeni2}/100</Text>
           <LottieView 
              ref={barRef}
              source={require('../assets/load.json')} 
              style={[styles.loadAnimation]} 
              autoPlay={false}  
              loop={false}
            />
        </View>
        </View>
        <View style={[{marginLeft:30}]}>
            <Text style={[{fontSize:20,color:dark?'white':'#124460'}]}>
                Broj celih stabala: {Math.floor(poeni/100)}
            </Text>
        </View>
        <View style={[{marginLeft:30}]}>
            <Text style={[{marginTop:5, fontSize:15,color:dark?'white':'#124460'}]}>
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
    marginLeft:'20%',
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
      bottom:2,
      fontWeight: '500',
      color: 'black',
      textAlign: 'center',
    }
  });
export default Tree;