import { useRouter } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal, FlatList, ListRenderItemInfo, StatusBar, AppState, Platform, SafeAreaView } from 'react-native';
import BackNav from '../components/Backnav';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';

const { height } = Dimensions.get('window'); 

interface User {
  user_id: number;
  ime: string;
  prezime: string;
  broj_bodova: number;
  rank?: number;
}

const Icon4 = () => {
  const router = useRouter();
  const [canTakeQuiz, setCanTakeQuiz] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [dark, setDark] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const flatListRef = useRef<FlatList<User>>(null); 
  const [highlightedUser, setHighlightedUser] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]); 
  const [logId, setLogId] = useState<number | null>(null); 
  const [logIndex, setLogIndex] = useState<number | null>(null); 

  const config = require('../../config.json');
  const ip = config.ipAddress;

  const [appState, setAppState] = useState(AppState.currentState);
  
    useEffect(() => {
      if (Platform.OS === 'ios') {
        StatusBar.setBarStyle('default'); 
      } else {
        StatusBar.setBarStyle(dark ? 'light-content' : 'dark-content'); 
        StatusBar.setBackgroundColor(dark ? '#124460' : '#fff'); 
      }
  
      const subscription = AppState.addEventListener('change', nextAppState => {
        if (appState.match(/inactive|background/) && nextAppState === 'active') {
          if (Platform.OS === 'ios') {
            StatusBar.setBarStyle('default'); 
          } else {
            StatusBar.setBarStyle(dark ? 'light-content' : 'dark-content');
            StatusBar.setBackgroundColor(dark ? '#124460' : '#fff');
          }
        }
        setAppState(nextAppState);
      });
  
      return () => {
        subscription.remove(); 
      };
    }, [appState, dark]);

  useEffect(() => {
    const getMode = async () => {
      const storedMode = await AsyncStorage.getItem('darkMode');
      if (storedMode === 'true') {
        setDark(true);
      } else {
        setDark(false);
      }
    };

    getMode();
  }, []);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get(`http://${ip}:8080/v1/api/getAll`);

        const filteredData = response.data.map(({ user_id, ime, prezime, broj_bodova }: User) => ({
          user_id,
          ime,
          prezime,
          broj_bodova,
        }))
        .sort((a: User, b: User) => b.broj_bodova - a.broj_bodova);

        let rank = 1;
        filteredData.forEach((user: User, index: number) => {
          if (index > 0 && user.broj_bodova < filteredData[index - 1].broj_bodova) {
            rank = index + 1;
          }
          user.rank = rank;
        });
        
        setUsers(filteredData);
      } catch (error) {
      }
    };

    getUsers();
  }, []);

  useEffect(() => {
    const checkIfCanTakeQuiz = async () => {
      const userInfo = await AsyncStorage.getItem('userInfo');

      if (userInfo) {
        const user = JSON.parse(userInfo);
        setLogId(user.userId);

        try {
          const korisnik = await axios.get(`http://${ip}:8080/v1/api/${user.userId}`);

          const dateString = korisnik.data.radjen;
          const date = new Date(dateString);

          date.setHours(date.getHours() + 1);

          const dateString2 = date.toISOString();
          const dateFromString = new Date(dateString2);
          const currentDate = new Date();

          const isSameDay =
            dateFromString.getUTCFullYear() === currentDate.getUTCFullYear() &&
            dateFromString.getUTCMonth() === currentDate.getUTCMonth() &&
            dateFromString.getUTCDate() === currentDate.getUTCDate();

          if (isSameDay) {
            setCanTakeQuiz(false);
          }
        } catch (error) {
        }
      }
    };

    checkIfCanTakeQuiz();
  }, []);

  const handleStartQuiz = async () => {
    const userInfo = await AsyncStorage.getItem('userInfo');
    if (userInfo == null) {
      router.push('/Login');
      return;
    }

    if (canTakeQuiz) {
      router.push('/QuizPage');
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    if (users.length > 0 && logId !== null) {
      const index = users.findIndex(user => user.user_id === logId);
      setLogIndex(index !== -1 ? index : null);
    }
  }, [users, logId]);

  useEffect(() => {
    if (modalVisible && logIndex !== null && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: logIndex, animated: true, viewPosition: 0.5 });

        setHighlightedUser(logId);
        setTimeout(() => {
          setHighlightedUser(null);
        }, 1000);
      }, 500);
    }
  }, [modalVisible, logIndex]);

  const onUserPress = (user: User) => {
    router.push({
      pathname: '/UserInfo',
      params: { id: user.user_id },
    });
  };

  return (
    <SafeAreaView style={{flex:1, backgroundColor:dark?'#124460':'white'}}>
      <BackNav />
      <View style={[styles.container, { backgroundColor: dark ? '#124460' : '#f5f5f5' }]}>
        <View style={styles.contentContainer}>
          <Text style={[styles.title, { color: dark ? 'white' : '#333' }]}>Dobrodošli u kviz!</Text>
          <Text style={[styles.subtitle, { color: dark ? 'white' : '#555' }]}>
            Pred Vama je dnevni kviz o životnoj sredini. Sastoji se od 5 pitanja. Kviz možete raditi samo jednom dnevno
            i nakon urađenog kviza dobijate odgovarajući broj kviz bodova.
          </Text>

          <TouchableOpacity style={[styles.startButton, { backgroundColor: '#6ac17f' }]} onPress={handleStartQuiz}>
            <Text style={styles.buttonText}>Počni kviz</Text>
          </TouchableOpacity>

          <View style={[{ marginTop: 20 }]}>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}>
              <Text style={[{ color: dark ? 'white' : '#124460', fontSize: 18, fontWeight: '500', textDecorationLine: 'underline', marginRight: 5 }]}>
                Rang lista korisnika
              </Text>
              <MaterialIcons name={"arrow-forward-ios"} size={20} color={dark ? 'white' : '#124460'} style={[{ paddingRight: 10, marginTop: 2 }]} />
            </TouchableOpacity>
          </View>

          {error && (
            <Text style={[styles.errorMessage, { color: dark ? '#ff999c' : '#9a2626' }]}>Već ste radili današnji kviz!</Text>
          )}
        </View>
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={[{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.7)' }]}>
          <View style={[{ width: '100%', height: height * 0.7, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: dark ? '#124460' : 'white' }]}>
            <View style={[{ marginTop: 20, alignItems: 'flex-end', justifyContent: 'flex-end', marginRight: 20, marginBottom: 20 }]}>
              <TouchableOpacity onPress={() => { setModalVisible(false); }}>
                <MaterialIcons name="close" size={30} color={dark ? 'white' : '#124460'} />
              </TouchableOpacity>
            </View>

            <Text style={[{ fontSize: 20, fontWeight: 'bold', marginBottom: 30, marginLeft: 20, color: dark ? '#fff' : '#124460' }]}>
              Rang lista korisnika
            </Text>

            {users.length === 0 ? (
              <Text style={[{ color: dark ? '#ccc' : '#124460', fontSize: 18, marginLeft: 20 }]}>Nema korisnika.</Text>
            ) : (
              <View style={{ flex: 1, paddingHorizontal: 20, marginBottom: 20 }}>
                <FlatList
                  ref={flatListRef}
                  data={users}
                  keyExtractor={(item) => item.user_id.toString()}
                  renderItem={({ item }: ListRenderItemInfo<User>) => {
                    let rankColor = dark ? '#ddd' : 'white';
                    let medalIcon = null;

                    if (item.rank === 1) {
                      rankColor = dark ? '#2f6d8c' : 'white';
                      medalIcon = <FontAwesome6 name="medal" size={20} color="#FFD700" />;
                    } else if (item.rank === 2) {
                      rankColor = dark ? '#2f6d8c' : 'white';
                      medalIcon = <FontAwesome6 name="medal" size={20} color="#C0C0C0" />;
                    } else if (item.rank === 3) {
                      rankColor = dark ? '#2f6d8c' : 'white';
                      medalIcon = <FontAwesome6 name="medal" size={20} color="#CD7F32" />;
                    }

                    return (
                      <View
                        style={{
                          backgroundColor: highlightedUser === item.user_id ? (dark ? '#285d78' : '#bdbdbd') : (dark ? '#2f6d8c' : '#d3d3d3'),
                          paddingHorizontal: 15,
                          paddingVertical: 10,
                          marginBottom: 20,
                          borderRadius: 10,
                          marginHorizontal: 10,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <View
                          style={{
                            width: 35,
                            height: 35,
                            borderRadius: 17.5,
                            borderColor: 'black',
                            backgroundColor: rankColor,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 10,
                          }}
                        >
                          {medalIcon ? medalIcon : <Text style={{ color: dark ? '#124460' : '#124460', fontSize: 16, fontWeight: 'bold' }}>{item.rank}</Text>}
                        </View>

                        <TouchableOpacity onPress={() => onUserPress(item)}>
                          <Text style={{ color: dark ? 'white' : '#124460', fontSize: 16, fontWeight: '500' }}>
                            {item.ime} {item.prezime}
                          </Text>
                        </TouchableOpacity>

                        <Text
                          style={{
                            color: dark ? 'white' : '#124460',
                            fontSize: 18,
                            fontWeight: '500',
                            position: 'absolute',
                            right: 20,
                          }}
                        >
                          {item.broj_bodova}
                        </Text>
                      </View>
                    );
                  }}
                />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 40,
    textAlign: 'center',
  },
  startButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorMessage: {
    color: '#9a2626',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
});

export default Icon4;
