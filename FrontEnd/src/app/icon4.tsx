import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BackNav from '../components/Backnav';

const Icon4 = () => {
  const router = useRouter();

  const handleStartQuiz = () => {
    router.push('/QuizPage');
  };

  return (
    <View style={styles.container}>
      <BackNav />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Dobrodošli u kviz!</Text>
        <Text style={styles.subtitle}>
          Pred Vama je dnevni kviz o životnoj sredini. Sastoji se od 5 pitanja.
        </Text>

        <TouchableOpacity style={styles.startButton} onPress={handleStartQuiz}>
          <Text style={styles.buttonText}>Počni kviz</Text>
        </TouchableOpacity>
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
});

export default Icon4;
