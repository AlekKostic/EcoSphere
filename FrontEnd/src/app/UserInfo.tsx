import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackNav from '../components/Backnav';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const UserInfo = () => {
  const [user, setUser] = useState({
    name: '',
    surname: '',
    email: '',
    city: '',
    password: '',
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userInfo');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    };

    fetchUserInfo();
  }, []);

  const handleChangePassword = async () => {

    if(!newPassword )
    {
       setErrorMessage('Unesite novu lozinku.');
       return;
    }
    if(!newPassword )
    {
        setErrorMessage('Potvrdite novu lozinku.');
        return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Lozinke se ne poklapaju.');
      return;
    }

    if (currentPassword !== user.password) {
      setErrorMessage('Trenutna lozinka nije ispravna.');
      setErrorMessage(currentPassword + " " + user.password)
      return;
    }

    const updatedUser = { ...user, password: newPassword };

    try {
      await AsyncStorage.setItem('userInfo', JSON.stringify(updatedUser));
      setUser(updatedUser); 
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrorMessage(''); 
    } catch (err) {
      console.error('Error updating password:', err);
      setErrorMessage('Greška prilikom promene lozinke.');
    }
  };

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <BackNav />
      <View style={styles.profileContainer}>
        <Image
          source={require('../img/icon1.png')}
          style={styles.profileImage}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {user.name} {user.surname}
          </Text>
          <Text style={styles.userDetails}>{"E-mail: " + (user.email || 'E-mail nije naveden')}</Text>
          <Text style={styles.userDetails}>{"Grad: " + (user.city || 'Grad nije naveden')}</Text>
        </View>
      </View>

      <View style={styles.passwordChangeContainer}>
        <Text style={styles.changePasswordTitle}>Promena lozinke</Text>

        <Text style={styles.label}>Trenutna lozinka</Text>
        <TextInput
          autoCorrect={false}
          clearButtonMode="while-editing"
          style={styles.input}
          placeholder="Unesite trenutnu lozinku..."
          placeholderTextColor="gray"
          secureTextEntry={true}
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />

        <Text style={styles.label}>Nova lozinka</Text>
        <TextInput
          autoCorrect={false}
          clearButtonMode="while-editing"
          style={styles.input}
          placeholder="Unesite novu lozinku..."
          placeholderTextColor="gray"
          secureTextEntry={true}
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <Text style={styles.label}>Potvrdite novu lozinku</Text>
        <TextInput
        autoCorrect={false}
          clearButtonMode="while-editing"
          style={styles.input}
          placeholder="Potvrdite novu lozinku..."
          placeholderTextColor="gray"
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity onPress={handleChangePassword} style={styles.button}>
          <Text style={styles.buttonText}>Promenite lozinku</Text>
        </TouchableOpacity>

        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  profileContainer: {
    backgroundColor: '#dedddc',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
  },
  userDetails: {
    fontSize: 15,
    color: '#666',
  },
  passwordChangeContainer: {
    paddingHorizontal: 20,
  },
  changePasswordTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: '#C9D3DB',
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 12,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  button: {
    
    marginTop: 10,
    backgroundColor: '#075eec',
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  errorMessage: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
  },
});

export default UserInfo;
