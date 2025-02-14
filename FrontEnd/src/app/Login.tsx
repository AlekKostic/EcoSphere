import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, TextInput, ActivityIndicator, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BackNav from '../components/Backnavhome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnimatedInputField from '../components/AnimatedInput';

const Login = () => {

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
    email: '',
    password: '',
  });

  const config = require('../../config.json');
  const ip = config.ipAddress;

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
          kviz: response.data.radjen,
          streak: response.data.streak
        };

        await AsyncStorage.setItem('userInfo', JSON.stringify(transformedData));
        router.push('/Home');
      }
    } catch (error:any) {
      if (error.status === "500") {
        setError(true);
        setErrorText("Pogrešan e-mail ili lozinka.");
        setIsLoading(false); 
        return;
      }
      setError(true);
      setErrorText("Pogrešan e-mail ili lozinka.");
      setIsLoading(false); 
    }
  };

  const handleSignin = () => {
    router.push('/Signup');
  };

  return (
    <>
          <BackNav />
    <SafeAreaView style={[styles.safeArea, dark ? styles.safeAreaDark : styles.safeAreaLight]}>

      <KeyboardAwareScrollView 
        style={styles.container} >
        <View style={styles.header}>
          <Image 
            source={require('../img/logo.png')}
            style={styles.headerImage} 
          />
          <Text style={[styles.subtitle, dark ? styles.subtitleDark : styles.subtitleLight]}>
            Održivost počinje ovde.
          </Text>
          <Text style={[styles.title, dark ? styles.titleDark : styles.titleLight]}>
            Ulogujte se na <Text style={dark ? styles.greenTextDark : styles.greenTextLight}>EcoSphere</Text>
          </Text>
        </View>
        <View style={[styles.form, { paddingBottom: 30 }]}>
          <AnimatedInputField
            label="Email"
            value={form.email}
            onChangeText={(email: string) => setForm({ ...form, email })}
            dark={dark}
          />
          <AnimatedInputField
            label="Lozinka"
            value={form.password}
            onChangeText={(password: string) => setForm({ ...form, password })}
            dark={dark}
          />
          <View style={styles.formAction}>
            <TouchableOpacity onPress={handleLogin}>
              <View style={[styles.btn, isLoading && { backgroundColor: '#ccc' }]}>
                <Text style={styles.btnText}>Ulogujte se</Text>
              </View>
            </TouchableOpacity>
          </View>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={[styles.error, {color: dark ? '#ff999c' : '#9a2626'}]}>
                {errorText}
              </Text>
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>
      <TouchableOpacity onPress={handleSignin}>
        <Text style={[styles.formFooter, dark ? styles.formFooterDark : styles.formFooterLight]}>
          Nemate nalog?{' '}
          <Text style={{ textDecorationLine: 'underline' }}>Registrujte se</Text>
        </Text>
      </TouchableOpacity>
      {isLoading && (<>
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={dark?'white':'#6ac17f'} />
          <Text style={[styles.loadingText, {color:dark?'white':'#6ac17f'}]}>Proveravanje podataka...</Text>
        </View>
        </>
      )}
    </SafeAreaView>
    </>
  );
  
}
  



const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  safeAreaDark: {
    backgroundColor: '#124460',
  },
  safeAreaLight: {
    backgroundColor: '#fff',
  },
  container: {
    paddingVertical: '15%',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  title: {
    fontSize: 31,
    fontWeight: '700',
    marginBottom: 6,
  },
  titleLight: {
    color: '#124460',
  },
  titleDark: {
    color: 'white',
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
  greenTextLight: {
    color: '#6ac17f',
  },
  greenTextDark: {
    color: '#6ac17f',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 36,
  },
  headerImage: {
    width: 80,  
    height: 80,  
    marginBottom: 25,  
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
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
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
    color: '#222',
    borderColor: '#124460',
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
  errorContainer: {
    alignItems: 'center',
  },
  error: {
    fontSize: 18,
    color: '#9a2626',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
