import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, StatusBar, Platform, AppState, SafeAreaView } from 'react-native';
import BackNav from '../components/Backnav';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Icon1 = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dark, setDark] = useState(false);

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

  return (
    <SafeAreaView style={[styles.container, {backgroundColor:dark?'#124460':'white'}]}>
      <BackNav />
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Učitavanje...</Text>
        </View>
      )}
      <WebView
        source={{ uri: 'https://gdereciklirati.rs/' }}
        style={styles.webview}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#000',
  },
});

export default Icon1;