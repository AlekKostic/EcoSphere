import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BackNav from '../components/Backnav';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const config = require('../../config.json');
  const ip = config.ipAddress

  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    const { email, password } = form;

    if (!email || !password) {
      setError(true);
      setErrorText("Molimo unesite oba podatka.");
      return;
    }

    setError(false);
    setErrorText("");
    setIsLoading(true);

    try {
      const response = await axios.post(`http://${ip}:8080/v1/api/login`,{
        email: email,
        password: password
      });

      console.log(response)
      
      setError(false);
      setErrorText("");
      setIsLoading(false);

      if (response.data) {
        const transformedData = {
          userId: response.data.user_id,
          name: response.data.ime,
          surname: response.data.prezime,
          email: response.data.email,
          password: password,
        };

        console.log(transformedData)


        await AsyncStorage.setItem('userInfo', JSON.stringify(transformedData));
        router.push('/Home');
      }
    } catch (error) {

      if(error.status=="500"){
        setError(true);
        setErrorText("Pogrešan e-mail ili lozinka.");
        setIsLoading(false); 
        return;
      }
      alert(error)
      setError(true);
      setErrorText('Greška prilikom logovanja. Molimo pokušajte ponovo.');
      setIsLoading(false); 
    }
  };

  const handleSignin = () => {
    router.push('/Signup');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#124460' }}>
      <BackNav />
      <KeyboardAwareScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.subtitle}>Održivost počinje ovde.</Text>
          <Text style={styles.title}>
            Ulogujte se na <Text style={{ color: '#6ac17f' }}>EcoSphere</Text>
          </Text>
        </View>
        <View style={styles.form}>
        <Text style={styles.inputLabel}>E-mail adresa</Text>
          <View style={styles.input}>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
              keyboardType="email-address"
              onChangeText={email => setForm({ ...form, email })}
              placeholder="mail@example.com"
              placeholderTextColor="#124460"
              style={styles.inputControl}
              value={form.email}
            />
          </View>
          <View style={styles.input}>
          <Text style={styles.inputLabel}>Lozinka</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={password => setForm({ ...form, password })}
                placeholder="********"
                placeholderTextColor="#124460"
                style={styles.inputControl}
                secureTextEntry={!showPassword}
                value={form.password}
              />
              <MaterialCommunityIcons
                name={!showPassword ? 'eye-off' : 'eye'}
                size={24}
                color="#aaa"
                onPress={toggleShowPassword}
                style={styles.icon}
              />
            </View>
          </View>
          <View style={styles.formAction}>
            <TouchableOpacity onPress={handleLogin}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Ulogujte se</Text>
              </View>
            </TouchableOpacity>
          </View>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.error}>{errorText}</Text>
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>
      <TouchableOpacity onPress={handleSignin}>
        <Text style={styles.formFooter}>
          Nemate nalog?{' '}
          <Text style={{ textDecorationLine: 'underline' }}>Registrujte se</Text>
        </Text>
      </TouchableOpacity>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#075eec" />
          <Text style={styles.loadingText}>Proveravanje podataka...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    paddingVertical: '30%',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  title: {
    fontSize: 31,
    fontWeight: '700',
    color: 'white',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 23,
    fontWeight: '700',
    color: '#6ac17f',
    marginBottom: 10,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 36,
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
    color: 'white',
    textAlign: 'center',
    letterSpacing: 0.15,
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  inputControl: {
    flex: 1,
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    borderWidth: 1,
    borderColor: 'white',
    borderStyle: 'solid',
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
  errorContainer: {
    alignItems: 'center',
  },
  error: {
    fontSize: 18,
    color: 'red',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#124460',
  },
});

export default Login;