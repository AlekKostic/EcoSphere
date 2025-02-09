import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, TextInput, ActivityIndicator, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BackNav from '../components/Backnavhome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AnimatedInputField from '../components/AnimatedInput';

const Signup = () => {
  const router = useRouter();
  const [dark, setDark] = useState(false);

  const getMode = async () => {
    const storedMode = await AsyncStorage.getItem('darkMode');
    if (storedMode === "true") setDark(true);
  }

  useEffect(() => {
    getMode();
  }, []);

  const [form, setForm] = useState({
    name: '',
    surname: '',
    city: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [isLoading, setIsLoading] = useState(false); 
  const [showPassword, setShowPassword] = useState(false);

  const config = require('../../config.json');
  const ip = config.ipAddress;

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = () => {
    router.push('/Login');
  };

  const handleSignin = async () => {
    const { name, surname, city, email, password } = form;

    if (!name || !surname || !email || !password) {
      setError(true);
      setErrorText("Svako polje mora biti popunjeno")
      return;
    }

    setError(false);
    setErrorText("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        `http://${ip}:8080/v1/api`,
        {
          ime: name,
          prezime: surname,
          email: email,
          password: password,
          brojPoena: 0
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 3000,
        }
      );

      const userId = response.data.id;
      const userInfo = {
        userId: userId,
        name,
        surname,
        email,
        password,
      };

      console.log(response.data)

      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));

      router.push('/Home');
    } catch (err) {
      console.log(error)
      setErrorText("Greška prilikom registraciije. Molimo pokušajte ponovo.");
      setError(true);
    } finally {
      setIsLoading(false); 
    }
  };

  const handleBack = () => {
    router.push('/App');
  };

  return (
    <SafeAreaView style={[styles.safeArea, dark ? styles.safeAreaDark : styles.safeAreaLight]}>
      <BackNav/>
      <KeyboardAwareScrollView style={styles.container}>
        <View style={styles.header}>
          <Image source={require('../img/logo.png')} style={styles.logo} />
          <Text style={[styles.subtitle, dark ? styles.subtitleDark : styles.subtitleLight]}>Održivost počinje ovde.</Text>
          <Text style={[styles.title, dark ? styles.titleDark : styles.titleLight]}>
            Registrujte se na <Text style={dark ? styles.greenTextDark : styles.greenTextLight}>EcoSphere</Text>
          </Text>
        </View>
        <View style={styles.form}>
          <AnimatedInputField
            label="Ime"
            value={form.name}
            onChangeText={(name) => setForm({ ...form, name })}
            dark={dark}
          />
          <AnimatedInputField
            label="Prezime"
            value={form.surname}
            onChangeText={(surname) => setForm({ ...form, surname })}
            dark={dark}
          />
          <AnimatedInputField
            label="Email"
            value={form.email}
            onChangeText={(email) => setForm({ ...form, email })}
            dark={dark}
          />
          <AnimatedInputField
            label="Lozinka"
            value={form.password}
            onChangeText={(password) => setForm({ ...form, password })}
            dark={dark}
          />
          <View style={styles.formAction}>
            <TouchableOpacity onPress={handleSignin} disabled={isLoading}>
              <View style={[styles.btn, isLoading && { backgroundColor: '#ccc' }]}>
                <Text style={styles.btnText}>Registrujte se</Text>
              </View>
            </TouchableOpacity>
          </View>
          {error && (
            <View style={styles.errorcontainer}>
              <Text style={[styles.error, {color: dark? '#ff999c':'#9a2626'}]}>{errorText}</Text>
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>
      <TouchableOpacity onPress={handleLogin}>
        <Text style={[styles.formFooter, dark ? styles.formFooterDark : styles.formFooterLight]}>
          Već imate nalog? <Text style={{ textDecorationLine: 'underline' }}>Ulogujte se</Text>
        </Text>
      </TouchableOpacity>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#075eec" />
          <Text style={styles.loadingText}>Kreiranje naloga...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  safeAreaLight: {
    backgroundColor: '#fff',
  },
  safeAreaDark: {
    backgroundColor: '#124460',
  },
  container: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    paddingVertical: '5%',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  logo: {
    width: 40, 
    height: 40, 
    marginBottom: 20, 
  },
  subtitle: {
    fontSize: 23,
    fontWeight: '700',
    marginBottom: 10,
  },
  subtitleLight: {
    color: '#6ac17f',
  },
  subtitleDark: {
    color: '#6ac17f',
  },
  title: {
    fontSize: 25,
    fontWeight: '700',
    color: '#1D2A32',
  },
  titleLight: {
    color: '#124460',
  },
  titleDark: {
    color: 'white',
  },
  greenTextLight: {
    color: '#6ac17f',
  },
  greenTextDark: {
    color: '#6ac17f',
  },
  form: {
    marginBottom: 24,
    paddingHorizontal: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  formAction: {
    marginTop: 4,
    marginBottom: 16,
  },
  formFooter: {
    paddingVertical: 24,
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    letterSpacing: 0.15,
  },
  formFooterLight: {
    color: '#124460',
  },
  formFooterDark: {
    color: 'white',
  },
  input: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  inputLabelLight: {
    color: '#124460',
  },
  inputLabelDark: {
    color: 'white',
  },
  inputControl: {
    flex: 1,
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    borderWidth: 1,
  },
  inputControlLight: {
    backgroundColor: '#fff',
    color: '#124460',
    borderColor: '#C9D3DB',
  },
  inputControlDark: {
    backgroundColor: 'white',
    color: '#124460',
    borderColor: '#E8F5E9',
  },
  passwordContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -12 }],
    zIndex: 1,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#6ac17f',
    borderColor: '#6ac17f',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#124460',
  },
  sustainabilityText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 20,
  },
  sustainabilityTextLight: {
    color: '#124460',
  },
  sustainabilityTextDark: {
    color: 'white',
  },
  errorcontainer: {
    alignItems: 'center',
  },
  error: {
    fontSize: 15,
    color: '#9a2626',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#fff',
  },
});

export default Signup;