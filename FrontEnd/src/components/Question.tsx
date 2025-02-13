import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Question = ({ quiz, onAnswer, showingFeedback }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackColor, setFeedbackColor] = useState('green');
  const [dark, setDark] = useState(false); 

  useEffect(() => {
    getMode(); 
  }, []);

  const getMode = async () => {
    const storedMode = await AsyncStorage.getItem('darkMode');
    if (storedMode === "true") {
      setDark(true);
    } else {
      setDark(false);
    }
  };

  const handleOptionPress = (option) => {
    if (showingFeedback) return;
    setSelectedOption(option);
    const isCorrect = option === quiz.correctAnswer;
    setFeedbackMessage(isCorrect ? 'Tačno!' : 'Netačno.');
    setFeedbackColor(isCorrect ? '#6ac17f' : '#9a2626');
    onAnswer(isCorrect);
  };

  return (
    <View style={[styles.quizContainer, { backgroundColor: dark ? '#124460' : 'white' }]}>
      <Text style={[styles.question, { color: dark ? 'white' : '#124460' }]}>{quiz.question}</Text>
      {quiz.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[ 
            styles.optionButton, 
            selectedOption === option && styles.selectedOption,
            { backgroundColor: dark ? (selectedOption === option ? '#23556e': '#2f6d8c') : (selectedOption === option ? '#cccccc': '#e0e0e0'), 
              borderColor: (selectedOption === option &&  option === quiz.correctAnswer
                || (option === quiz.correctAnswer))?'#6ac17f':'#ff999c',
                
              borderWidth: (selectedOption === option 
              || (option === quiz.correctAnswer && quiz.options.includes(selectedOption))) ? 3:0
            } 
          ]}
          onPress={() => handleOptionPress(option)}
        >
          <Text style={[styles.optionText, { color: dark ? 'white' : '#124460' }]}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  quizContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    padding: 15,
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: 'blue',
  },
  optionText: {
    fontSize: 18,
  },
  feedback: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default Question;
