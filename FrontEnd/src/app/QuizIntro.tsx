import { useRouter } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal, FlatList } from 'react-native';
import BackNav from '../components/Backnav';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
const { height } = Dimensions.get('window'); // Dobijamo visinu ekrana

const Icon4 = () => {
  const router = useRouter();
  const [canTakeQuiz, setCanTakeQuiz] = useState(true);
  const [error, setError] = useState(false);
  const [dark, setDark] = useState(false);
  const [modalVisible, setModalVisible]=useState(false)
  const flatListRef=useRef(null)
  const [highlightedUser, setHighlightedUser] = useState(null); 

  const [users, setUsers]=useState([])

  const [logId, setLogId]=useState(null)
  const [logIndex, setLogIndex]=useState(null)

  const config = require('../../config.json');
  const ip = config.ipAddress;

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

  useEffect(()=>{
    const getUsers = async()=>{
      console.log("ee")
      const response = await axios.get(`http://${ip}:8080/v1/api/getAll`)

      const filteredData = response.data.map(({ user_id, ime, prezime, broj_bodova }) => ({
        user_id,
        ime,
        prezime,
        broj_bodova
      }))
      .sort((a, b) => b.broj_bodova - a.broj_bodova);;

      let rank = 1;
      filteredData.forEach((user, index) => {
        if (index > 0 && user.broj_bodova < filteredData[index - 1].broj_bodova) {
          rank = index + 1; 
        }
        user.rank = rank; 
      });
      console.log(filteredData)
      setUsers(filteredData)
    }

    getUsers();
  }, [])

  useEffect(() => {
    const checkIfCanTakeQuiz = async () => {
      const userInfo = await AsyncStorage.getItem('userInfo');
      
      if (userInfo) {
        const user = JSON.parse(userInfo);
        setLogId(user.userId)
        
        const korisnik = await axios.get(`http://${ip}:8080/v1/api/${user.userId}`);

        const dateString = korisnik.data.radjen;
        const date = new Date(dateString);

        date.setHours(date.getHours() + 1);

        const dateString2 = date.toISOString();
        console.log(dateString);

        const dateFromString = new Date(dateString2);

        const currentDate = new Date();
        console.log("Current Date:", currentDate.toISOString());
        console.log("Date from String:", dateFromString.toISOString());

        console.log(currentDate.getUTCDate() + " " + dateFromString.getUTCDate());

        const isSameDay =
          dateFromString.getUTCFullYear() === currentDate.getUTCFullYear() &&
          dateFromString.getUTCMonth() === currentDate.getUTCMonth() &&
          dateFromString.getUTCDate() === currentDate.getUTCDate();

        if (isSameDay) {
          setCanTakeQuiz(false);
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
      setLogIndex(index !== -1 ? index : null); // Ako ga nema, stavi null
    }
  }, [users, logId]);
  
  useEffect(() => {
    if (modalVisible && logIndex !== null && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToIndex({ index: logIndex, animated: true, viewPosition: 0.5 });
        
        setHighlightedUser(logId); // Postavi korisnika koji treba da potamni
        setTimeout(() => {
          setHighlightedUser(null); // Posle 1 sekunde vrati u normalno stanje
        }, 1000); // Ovaj timeout je unutar prvog
      }, 500); // Ovaj timeout je za skrolovanje
    }
  }, [modalVisible, logIndex]);
  

  const onUserPress = (user) => {
    router.push({
      pathname: '/UserInfo',
      params: { id: user.user_id },
    });
  };

  return (
    <>
    <BackNav />
    <View style={[styles.container, { backgroundColor: dark ? '#124460' : '#f5f5f5' }]}>

      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: dark ? 'white' : '#333' }]}>Dobrodošli u kviz!</Text>
        <Text style={[styles.subtitle, { color: dark ? 'white' : '#555' }]}>
          Pred Vama je dnevni kviz o životnoj sredini. Sastoji se od 5 pitanja.
          Kviz možete raditi samo jednom dnevno i nakon urađenog kviza dobijate odgovarajući broj
          kviz bodova.
        </Text>

        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: '#6ac17f' }]}
          onPress={handleStartQuiz}
        >
          <Text style={styles.buttonText}>Počni kviz</Text>
        </TouchableOpacity>

        <View style={[{marginTop:20}]}>
          <TouchableOpacity onPress={()=>setModalVisible(true)} style={[{
            flexDirection:'row',
            alignItems: 'center', 
            justifyContent: 'center'}]}>
            <Text style={[{color:dark ? 'white' : '#124460',
              fontSize:18,
              fontWeight:'500',
              textDecorationLine:'underline',
              marginRight:5
            }]}>Rang lista korisnika</Text>
            <MaterialIcons
            name={"arrow-forward-ios"} 
            size={20}
            color={dark ? 'white' : '#124460'}
            style={[{paddingRight:10, marginTop:2}]}
          />
          </TouchableOpacity>
        </View>
        

        {error && (
          <Text style={[styles.errorMessage, {color: dark? '#ff999c':'#9a2626'}]}>Već ste radili današnji kviz!</Text>
        )}
      </View>
    </View>

    <Modal visible={modalVisible} animationType="slide" transparent={true} >
      <View style={[{flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.7)'}]}>

        <View style={[{width: '100%',
          height: height * 0.7,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20, 
          backgroundColor: dark ? '#124460' : 'white' }]}>

          <View style={[{marginTop:20,
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            marginRight:20, marginBottom:20}]}>
            <TouchableOpacity onPress={()=>{setModalVisible(false)}}>
                <MaterialIcons name="close" size={30} color={dark ? 'white' : '#124460'} />
            </TouchableOpacity>
          </View>

          <Text style={[{fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 30,
            marginLeft:20, 
            color: dark ? '#fff' : '#124460' }]}>
              Rang lista korisnika</Text>

            {users.length === 0 ? (
              <Text style={[{ color: dark ? '#ccc' : '#124460',
                fontSize:18,
                marginLeft:20
               }]}>Nema korisnika.</Text>
            ) : (
              <View style={{ flex: 1, paddingHorizontal: 20, marginBottom: 20 }}>
  <FlatList
  ref={flatListRef}
    data={users}
    keyExtractor={(item) => item.user_id.toString()}
    renderItem={({ item }) => {
      let rankColor = dark ? '#ddd' : '#949494'; // Default boja za ostale
      let medalIcon = null;

      if (item.rank === 1) {
        rankColor = '#2f6d8c'; // Zlatna
        medalIcon = <FontAwesome6 name="medal" size={20} color="#FFD700" />;
      } else if (item.rank === 2) {
        rankColor = '#2f6d8c'; // Srebrna
        medalIcon = <FontAwesome6 name="medal" size={20} color="#C0C0C0" />;
      } else if (item.rank === 3) {
        rankColor = '#2f6d8c'; // Bronzana
        medalIcon = <FontAwesome6 name="medal" size={20} color="#CD7F32" />;
      }

      return (
        <View
          style={{
            backgroundColor:  highlightedUser===item.user_id?( dark ? '#285d78' : '#bdbdbd'):( dark ? '#2f6d8c' : '#d3d3d3'),
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
              borderColor:'black',
              backgroundColor: rankColor,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 10,
            }}
          >
            {medalIcon ? (
              medalIcon
            ) : (
              <Text
                style={{
                  color: dark?'black':'black',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}
              >
                {item.rank}
              </Text>
            )}
          </View>

          <TouchableOpacity onPress={() => onUserPress(item)}>
            <Text
              style={{
                color: dark ? 'white' : '#124460',
                fontSize: 16,
                fontWeight: '500',
              }}
            >
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
    </>
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
