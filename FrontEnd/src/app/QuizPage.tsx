import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, StatusBar, Platform, AppState } from 'react-native';
import BackNav from '../components/Backnavhome';
import Question from '../components/Question';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useRouter } from 'expo-router';


interface QuestionType {
  pitanje: string;
  id_Pitanja: number;
}
interface Quiz {
  correctAnswer: string;
  options: string[];
  question: string;
}
interface AnswerType {
  id_Odgovora: number;
  pitanje: QuestionType;
  odgovor: string;
  tacno: boolean;
}

const QuizPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showingFeedback, setShowingFeedback] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [questions, setQuestions] = useState<Quiz[]>([]);
  const [dark, setDark] = useState(false); 
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

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
      }
    };

    fetchUser();
  }, []);

  const getQuestions = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.get(`http://${ip}:8080/v2/api/`);
      if (!response.data || response.data.length === 0) {
        throw new Error("Baza nije vratila nijedno pitanje.");
      }

      

      const allQuestions = response.data;
      const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5).slice(0, 5);

      const questionsWithAnswers = await Promise.all(
        shuffledQuestions.map(async (question: QuestionType) => {

          const answersResponse = await axios.get(`http://${ip}:8080/v3/api/${question.id_Pitanja}`);
          if (!answersResponse.data ||   answersResponse.data.length === 0) {
            throw new Error(`Baza nije vratila odgovore za pitanje ID: ${question.id_Pitanja}`);
          }

          const answers = answersResponse.data;
          const correctAnswer = answers.find((ans:AnswerType) => ans.tacno)?.odgovor;

          return {
            question: question.pitanje,
            options: answers.map((ans:AnswerType) => ans.odgovor),
            correctAnswer,
          };
        })
      );

      setQuestions(questionsWithAnswers);
    } catch (error) {
      setErrorMessage("Pitanja su trenutno nedostupna. Pokušajte ponovo kasnije.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showingFeedback || quizCompleted || questions.length===0) return;

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
  }, [timeLeft, currentQuestionIndex, showingFeedback, quizCompleted, questions.length]);

  const handleNextQuestion = () => {
    setTimeLeft(15);
    setShowingFeedback(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleAnswer = (isCorrect: boolean) => {

    if (isCorrect) setCorrectAnswers((prev) => prev + 1);
    setShowingFeedback(true);

    setTimeout(() => {
      handleNextQuestion();
    }, 3000);
  };

  const dodajBodove = async () => {
    try{
    const value = await AsyncStorage.getItem('userInfo');
    const userInfo = value ? JSON.parse(value) : null;
    const userId = userInfo?.userId;

    await axios.put(`http://${ip}:8080/v1/api/bodovi`, {
      "user_id": userId,
      "broj_poena": correctAnswers,
    });
    if(userInfo.kviz){
      const resp = await axios.put(`http://${ip}:8080/v1/api/unstreak/${userId}`)
    }
    await axios.put(`http://${ip}:8080/v1/api/streak/${userId}`)

    await axios.put(`http://${ip}:8080/v1/api/uradjen/${userId}`);
    }catch(error){
      alert("Došlo je do greške prilikom dodavanja bodova. Pokušajte ponovo.");
    }
  };

  const visitTree = async () => {
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (userInfo) {
        const user = JSON.parse(userInfo);
        router.push({
          pathname: '/Tree',
          params: {userId: user.userId },
        });
      } else {
        return
      }
    } catch (error) {
    }
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
          <View style={[{ marginTop: 20 }]}>
            <TouchableOpacity onPress={visitTree} style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}>
                <Text style={[{ color: dark ? 'white' : '#124460', fontSize: 18, fontWeight: '500', textDecorationLine: 'underline', marginRight: 5 }]}>
                  Vidi stablo
                </Text>
                <MaterialIcons name={"arrow-forward-ios"} size={20} color={dark ? 'white' : '#124460'} style={[{ paddingRight: 10, marginTop: 2 }]} />
            </TouchableOpacity>
          </View>
        </View>
        <View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: dark ? '#124460' : 'white' }]}>
      <BackNav />

      {loading && (
        <View style={[{ justifyContent: 'center', alignItems: 'center', flex: 1 }]}>
        <ActivityIndicator size="large" color={dark?'white':'#124460'} />
        <Text style={{ color: dark?'white':'#124460', fontSize:18, marginTop:10 }}>Učitavanje pitanja</Text>
      </View>
      
      )}
      {errorMessage!=="" && 
      <View style={[{ justifyContent: 'center', alignItems: 'center', flex: 1 }]}>
        <Text style={{ color: dark?'white':'#124460', fontSize:18, marginTop:10 }}>
          Pitanja su trenutno nedostupna.
        </Text>
      </View>
      }
      {questions.length > 0 && (<>
      <Text style={[styles.timer, { color: dark ? 'white' : '#9a2626' }]}>Preostalo vremena: {timeLeft} sekundi</Text>

        <Question
          quiz={questions[currentQuestionIndex]}
          onAnswer={handleAnswer}
          showingFeedback={showingFeedback}
        />
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: dark ? 'white' : '#333' }]}>
          Pitanje {currentQuestionIndex + 1} od {questions.length}
        </Text>
      </View>
      </>
      
    )}
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