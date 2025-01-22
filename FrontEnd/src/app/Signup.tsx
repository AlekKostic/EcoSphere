import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BackNav from '../components/Backnav';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Signup = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    surname: '',
    city: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = () => {
    router.push('/Login');
  };

  const handleSignin = async () => {
    const { name, surname, city, email, password } = form;

    if (!name || !surname || !city || !email || !password) {
      setError(true);
      return;
    }

    setError(false);
    setIsLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:8080/v1/api',
        {
          ime: name,
          prezime: surname,
          email: email,
          password: password,
          grad: city,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const userId = response.data.id;
      const userInfo = {
        id: userId,
        name,
        surname,
        city,
        email,
        password,
      };

      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));

      router.push('/Home');
    } catch (err) {
      alert('Greška prilikom registracije. Molimo pokušajte ponovo.');
      setError(true);
    } finally {
      setIsLoading(false); 
    }
  };

  const handleBack = () => {
    router.push('/App');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <BackNav />

      <KeyboardAwareScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Registrujte se na <Text style={{ color: '#075eec' }}>EcoSphere</Text>
          </Text>
        </View>
        <View style={styles.form}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Ime</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(name) => setForm({ ...form, name })}
              placeholder="Ime..."
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              value={form.name}
            />
          </View>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Prezime</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(surname) => setForm({ ...form, surname })}
              placeholder="Prezime..."
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              value={form.surname}
            />
          </View>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Grad</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(city) => setForm({ ...form, city })}
              placeholder="Grad..."
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              value={form.city}
            />
          </View>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>E-mail addresa</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(email) => setForm({ ...form, email })}
              placeholder="mail@example.com"
              placeholderTextColor="#6b7280"
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
                onChangeText={(password) => setForm({ ...form, password })}
                placeholder="********"
                placeholderTextColor="#6b7280"
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
            <TouchableOpacity onPress={handleSignin} disabled={isLoading}>
              <View style={[styles.btn, isLoading && { backgroundColor: '#ccc' }]}>
                <Text style={styles.btnText}>Registrujte se</Text>
              </View>
            </TouchableOpacity>
          </View>
          {error && (
            <View style={styles.errorcontainer}>
              <Text style={styles.error}>Svako polje mora biti popunjeno</Text>
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>
      <TouchableOpacity onPress={handleLogin}>
        <Text style={styles.formFooter}>
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
  container: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1D2A32',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
  },
  /** Header */
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 36,
  },
  headerImg: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 36,
  },
  /** Form */
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
  formLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#075eec',
    textAlign: 'center',
  },
  formFooter: {
    paddingVertical: 24,
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    letterSpacing: 0.15,
  },
  /** Input */
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
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
    borderColor: '#C9D3DB',
    borderStyle: 'solid',
  },
  /** Button */
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#075eec',
    borderColor: '#075eec',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
  errorcontainer: {
    alignItems: 'center',
  },
  error: {
    fontSize: 18,
    color: 'red',
  },
  backbtn: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    textAlign: 'right',
    paddingRight: 24,
    paddingTop: 24,
    letterSpacing: 0.15,
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
  },loadingOverlay: {
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