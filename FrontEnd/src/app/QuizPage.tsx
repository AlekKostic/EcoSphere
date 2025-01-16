import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BackNav from '../components/Backnav';
import Question from '../components/Question';
import randomQuestions from '../data/questions';

const QuizPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [correctAnswers, setCorrectAnswers] = useState(0); 
  const [showingFeedback, setShowingFeedback] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false); 

  const questions = randomQuestions;

  useEffect(() => {
    if (showingFeedback) return; 

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
  }, [currentQuestionIndex, showingFeedback]);

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

  if (quizCompleted) {
    return (
      <View style={styles.container}>
        <BackNav />
        <View style={styles.container2}>
        <Text style={styles.resultTitle}>Završen kviz!</Text>
        <Text style={styles.resultText}>
          Tačno ste odgovorili na {correctAnswers} od {questions.length} pitanja.
        </Text>
        <Text style={styles.resultText}>
          Vratite se ponovo radite sutrašnji kviz!
        </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BackNav />
      <Text style={styles.timer}>Preostalo vremena: {timeLeft} sekundi</Text>
      <Question
        quiz={questions[currentQuestionIndex]}
        onAnswer={handleAnswer}
        showingFeedback={showingFeedback}
      />
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Pitanje {currentQuestionIndex + 1} od {questions.length}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container2: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timer: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: 'red',
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
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default QuizPage;
