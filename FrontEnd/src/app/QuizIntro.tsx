import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BackNav from '../components/Backnav';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Icon4 = () => {
  const router = useRouter();
  const [canTakeQuiz, setCanTakeQuiz] = useState(true);
  const [error, setError] = useState(false);
  const [dark, setDark] = useState(false);

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

  useEffect(() => {
    const checkIfCanTakeQuiz = async () => {
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (userInfo) {
        const user = JSON.parse(userInfo);
        
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

  return (
    <View style={[styles.container, { backgroundColor: dark ? '#124460' : '#f5f5f5' }]}>
      <BackNav />
      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: dark ? 'white' : '#333' }]}>Dobrodošli u kviz!</Text>
        <Text style={[styles.subtitle, { color: dark ? 'white' : '#555' }]}>
          Pred Vama je dnevni kviz o životnoj sredini. Sastoji se od 5 pitanja.
        </Text>

        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: '#6ac17f' }]}
          onPress={handleStartQuiz}
        >
          <Text style={styles.buttonText}>Počni kviz</Text>
        </TouchableOpacity>

        {error && (
          <Text style={styles.errorMessage}>Već ste radili današnji kviz!</Text>
        )}
      </View>
    </View>
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
