import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Question = ({ quiz, onAnswer, showingFeedback }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackColor, setFeedbackColor] = useState('green'); 

  const handleOptionPress = (option) => {
    if (showingFeedback) return; 
    setSelectedOption(option);
    const isCorrect = option === quiz.correctAnswer;
    setFeedbackMessage(isCorrect ? "Tačno!" : "Netačno.");
    setFeedbackColor(isCorrect ? 'green' : 'red');
    onAnswer(isCorrect); 
  };

  return (
    <View style={styles.quizContainer}>
      <Text style={styles.question}>{quiz.question}</Text>
      {quiz.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionButton,
            selectedOption === option && styles.selectedOption,
          ]}
          onPress={() => handleOptionPress(option)}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
      {showingFeedback && (
        <Text style={[styles.feedback, { color: feedbackColor }]}>
          {feedbackMessage}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  quizContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#cde4ff',
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
