import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BackNav from '../components/Backnavhome';
import Question from '../components/Question';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useRouter } from 'expo-router';

const QuizPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showingFeedback, setShowingFeedback] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [dark, setDark] = useState(false); 

  useEffect(() => {
    getQuestions();
    getMode();
  }, []);

  const config = require('../../config.json');
  const ip = config.ipAddress;
  const router = useRouter();

  const getMode = async () => {
    const storedMode = await AsyncStorage.getItem('darkMode');
    if (storedMode === "true") {
      setDark(true);
    } else {
      setDark(false);
    }
  };

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('userInfo');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  const getQuestions = async () => {
    try {
      const response = await axios.get(`http://${ip}:8080/v2/api/`);
      const allQuestions = response.data;
      const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5).slice(0, 5);
      const questionsWithAnswers = await Promise.all(
        shuffledQuestions.map(async (question) => {
          const answersResponse = await axios.get(`http://${ip}:8080/v3/api/${question.id_Pitanja}`);
          const answers = answersResponse.data;

          const correctAnswer = answers.find(ans => ans.tacno)?.odgovor;

          return {
            question: question.pitanje,
            options: answers.map(ans => ans.odgovor),
            correctAnswer,
          };
        })
      );

      setQuestions(questionsWithAnswers);
    } catch (error) {
      console.error('Error fetching questions or answers:', error);
    }
  };

  useEffect(() => {
    if (showingFeedback || quizCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          handleNextQuestion();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, currentQuestionIndex, showingFeedback, quizCompleted]);

  const handleNextQuestion = () => {
    setTimeLeft(15);
    setShowingFeedback(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setCorrectAnswers((prev) => prev + 1);
    setShowingFeedback(true);

    setTimeout(() => {
      handleNextQuestion();
    }, 3000);
  };

  const dodajBodove = async () => {
    const value = await AsyncStorage.getItem('userInfo');
    const userInfo = value ? JSON.parse(value) : null;
    const userId = userInfo?.userId;

    await axios.put(`http://${ip}:8080/v1/api/bodovi`, {
      "user_id": userId,
      "broj_poena": correctAnswers,
    });

    await axios.put(`http://${ip}:8080/v1/api/uradjen/${userId}`);
  };

  if (quizCompleted) {
    dodajBodove();
    return (
      <View style={[styles.container, { backgroundColor: dark ? '#124460' : 'white' }]}>
        <BackNav />
        <View style={styles.container2}>
          <Text style={[styles.resultTitle, { color: dark ? 'white' : '#124460' }]}>Završen kviz!</Text>
          <Text style={[styles.resultText, { color: dark ? 'white' : '#124460' }]}>
            Tačno ste odgovorili na {correctAnswers} od {questions.length} pitanja.
          </Text>
          <Text style={[styles.resultText, { color: dark ? 'white' : '#124460' }]}>
            Vratite se ponovo da radite sutrašnji kviz i ne zaboravite da posetite stablo!
          </Text>
        </View>
        <View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: dark ? '#124460' : 'white' }]}>
      <BackNav />
      <Text style={[styles.timer, { color: dark ? 'white' : '#9a2626' }]}>Preostalo vremena: {timeLeft} sekundi</Text>
      {questions.length > 0 && (
        <Question
          quiz={questions[currentQuestionIndex]}
          onAnswer={handleAnswer}
          showingFeedback={showingFeedback}
        />
      )}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: dark ? 'white' : '#333' }]}>
          Pitanje {currentQuestionIndex + 1} od {questions.length}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timer: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  resultText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  footer: {
    padding: 10,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default QuizPage;
