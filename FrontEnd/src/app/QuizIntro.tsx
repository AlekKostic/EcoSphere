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

  const config = require('../../config.json');
  const ip = config.ipAddress;

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

        const dateFromString = new Date(dateString2);

        const currentDate = new Date();

        const isSameDay =
          dateFromString.getFullYear() === currentDate.getFullYear() &&
          dateFromString.getMonth() === currentDate.getMonth() &&
          dateFromString.getDate() === currentDate.getDate();

        if (isSameDay) {
          setCanTakeQuiz(false);
        }
      }
    };

    checkIfCanTakeQuiz();
  }, []);

  const handleStartQuiz = async () => {
    const userInfo = await AsyncStorage.getItem('userInfo');

    if (canTakeQuiz) {
      router.push('/QuizPage');
    } else {
      setError(true); // Show error message
    }
  };

  return (
    <View style={styles.container}>
      <BackNav />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Dobrodošli u kviz!</Text>
        <Text style={styles.subtitle}>
          Pred Vama je dnevni kviz o životnoj sredini. Sastoji se od 5 pitanja.
        </Text>

        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartQuiz}
        >
          <Text style={styles.buttonText}>Počni kviz</Text>
        </TouchableOpacity>

        {/* Show error message if needed */}
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
    backgroundColor: '#f5f5f5',
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
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 40,
    color: '#555',
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorMessage: {
    color: 'red',  // Red color for error message
    fontSize: 16,
    marginTop: 20, // Adds some space between the button and the message
    textAlign: 'center', // Center the message
  },
});

export default Icon4;
