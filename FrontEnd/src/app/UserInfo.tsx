import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert, FlatList, ActivityIndicator, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackNav from '../components/Backnav';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRouter } from 'expo-router';
import axios from 'axios';
import Post from '../components/Post';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const UserInfo = () => {
  const route = useRoute();
  const iduser = route.params?.id ?? false;

  const [user, setUser] = useState({
    email: '',
    ime: '',
    likesids: [],
    postsids: [],
    prezime: '',
    broj_bodova: 0,
    radjen: ''
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [logged, setLogged] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [personal, setPersonal] = useState(false);
  const [changing, setChanging] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const router = useRouter();
  const config = require('../../config.json');
  const ip = config.ipAddress;
  
  const imageId = iduser % 6 + 1;
  let profileImageSource = require('../img/profilna6.png');

  if (imageId === 1) profileImageSource = require('../img/profilna1.png');
  else if (imageId === 2) profileImageSource = require('../img/profilna2.png');
  else if (imageId === 3) profileImageSource = require('../img/profilna3.png');
  else if (imageId === 4) profileImageSource = require('../img/profilna4.png');
  else if (imageId === 5) profileImageSource = require('../img/profilna5.png');

  const fetchUserInfo = async () => {
    try {
      console.log("ovde" +iduser)
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (userInfo) {
        const parsedUserInfo = JSON.parse(userInfo);
        const userId = parsedUserInfo.userId;
        if (userId.toString() === iduser.toString()) {
          setPersonal(true);
        }
        
        setLogged(true);
      }
    } catch (err) {
      console.error('Error fetching user info:', err);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchPostsData = async () => {
    try {
      const userres = await axios.get(`http://${ip}:8080/v1/api/${iduser}`);
      setUser(userres.data);
      
      const response = await axios.get(`http://${ip}:8080/v4/api`);
      const fetchedPosts = response.data;

      let dictionary = {};

      if (logged) {
        const userInfo2 = await AsyncStorage.getItem('userInfo');
        const parsedUserInfo2 = JSON.parse(userInfo2);
        const userId2 = parsedUserInfo2.userId;

        const response2 = await axios.get(`http://${ip}:8080/v4/api/user/${userId2}`);
        response2.data.forEach(item => {
          dictionary[item.postovis.id] = true;
        });
      }

      const postsWithAuthors = await Promise.all(
        userres.data.postsids.map(async (postId) => {
          const postResponse = await axios.get(`http://${ip}:8080/v4/api/${postId}`);
          const postData = postResponse.data;
          const authorResponse = await axios.get(`http://${ip}:8080/v1/api/${postData.authorId}`);
          const authorData = authorResponse.data;
          return {
            ...postData,
            author: authorData,
            likes: logged ? dictionary[postId] || false : false,
          };
        })
      );

      setPosts([...postsWithAuthors].reverse());
      setLoadingPosts(false);

    } catch (err) {
      console.error('Error fetching posts data:', err);
    }
  };

  useEffect(() => {
    fetchPostsData();
  }, [logged]);

  const handleChangePassword = async () => {
    if (!changing) {
      setChanging(true);
      return;
    }
    if (!newPassword) {
      setErrorMessage('Unesite novu lozinku.');
      return;
    }
    const odg = await AsyncStorage.getItem('userInfo');
    const parsedUserInfo = JSON.parse(odg);
    const userPas = parsedUserInfo.password;

    if (currentPassword !== userPas) {
      setErrorMessage('Trenutna lozinka nije ispravna.');
      return;
    }

    await axios.post(`http://${ip}:8080/v1/api/reset`,{
      "id_user": iduser,
      "password": currentPassword
    });

    const updatedUser = { ...user, password: newPassword };

    try {
      await AsyncStorage.setItem('userInfo', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setCurrentPassword('');
      setNewPassword('');
      setErrorMessage('');
      setChanging(false);
    } catch (err) {
      console.error('Error updating password:', err);
      setErrorMessage('Greška prilikom promene lozinke.');
    }
  };

  const handleDeletePost = async () => {
    try {
      await axios.delete(`http://${ip}:8080/v4/api/delete/${postToDelete}`);
      setDeleteModalVisible(false);
      fetchPostsData();
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const likePost = async (item) => {
    if (!logged) {
      router.push('/Login');
      return; // Prekida izvršavanje funkcije ako nije prijavljen
    }

    if (!item.likes) {
      item.likes = true;
      const value = await AsyncStorage.getItem('userInfo');
      const userInfo = value ? JSON.parse(value) : null;
      const userId = userInfo?.userId;

      console.log(userId + " " + item.id)
      try {
        const response = await axios.post(`http://${ip}:8080/v4/api/like`, {
          "user_id": userId,
          "post_id": item.id
        });
      
        console.log("Like response:", response.data);
      
        // Ponovo učitaj postove da vidiš da li je lajk sačuvan
        fetchPostsData();
      } catch (error) {
        console.log(error);
      }
    }else{
      item.likes=false;

      const value = await AsyncStorage.getItem('userInfo');
      const userInfo = value ? JSON.parse(value) : null;
      const userId = userInfo?.userId;

      console.log(userId + " " + item.id)
      try {
        const response = await axios.put(`http://${ip}:8080/v4/api/unlike`, {
          "user_id": userId,
          "post_id": item.id
        });
      
        console.log("Like response:", response.data);
        fetchPostsData();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Potvrdi brisanje',
      'Da li ste sigurni da želite da obrišete svoj nalog? Ova akcija se ne može poništiti.',
      [
        { text: 'Odustani', style: 'cancel' },
        {
          text: 'Obriši nalog',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userInfo');
              await axios.delete(`http://${ip}:8080/v1/api/delete/${iduser}`);
              router.push('/Home');
            } catch (err) {
              console.error('Error deleting account:', err);
              setErrorMessage('Greška prilikom brisanja naloga.');
            }
          },
        },
      ]
    );
  };

  return (
    <KeyboardAwareScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <BackNav />
      <View style={styles.profileContainer}>
        <Image source={profileImageSource} style={styles.profileImage} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {user.ime + ' ' + user.prezime}
          </Text>
          <Text style={styles.userDetails}>
            {'E-mail: ' + (user.email || 'E-mail nije naveden')}
          </Text>
        </View>
      </View>

      <View style={styles.bodovicontainer}>
        <Text style={styles.bodovi}>Broj ostavrenih kviz bodova: {user.broj_bodova}</Text>
      </View>

      {personal && (
        <>
          <View style={styles.passwordChangeContainer}>
            {changing && (
              <>
                <View style={styles.changePasswordHeader}>
                  <Text style={styles.changePasswordTitle}>Promena lozinke</Text>
                  <TouchableOpacity onPress={() => setChanging(false)} style={styles.cancelButton}>
                    <Text style={styles.buttonText}>X</Text>
                  </TouchableOpacity>
                </View>

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
              </>
            )}

            <TouchableOpacity onPress={handleChangePassword} style={styles.button}>
              <Text style={styles.buttonText}>Promenite lozinku</Text>
            </TouchableOpacity>

            {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
          </View>

          <TouchableOpacity onPress={handleDeleteAccount} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Obrišite nalog</Text>
          </TouchableOpacity>
        </>
      )}

      <Text style={styles.postsHeader}>Objave korisnika</Text>

      {loadingPosts ? (
        <ActivityIndicator size="large" color="#075eec" style={styles.loadingIndicator} />
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <Post key={post.id} item={post} likePost={likePost} personal={personal}
          handleDelete={() => { setPostToDelete(post.id); setDeleteModalVisible(true); }} />
        ))
      ) : (
        <Text style={styles.noPostsText}>Nema postova za prikazivanje.</Text>
      )}

      <Modal
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Potvrdi brisanje</Text>
            </View>
            <Text style={styles.modalText}>Da li ste sigurni da želite da obrišete ovaj post?</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={handleDeletePost}
              >
                <Text style={styles.deleteButtonText2}>Obriši</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Otkaži</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  postsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20,
    color: '#333',
  },
  loadingIndicator: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
    width: 80,
    height: 80,
    borderRadius: 50,
    marginRight: 20,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#333',
  },
  userDetails: {
    marginTop: 5,
    fontSize: 15,
    color: '#666',
  },
  passwordChangeContainer: {
    paddingHorizontal: 20,
  },
  changePasswordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  changePasswordTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 30,
    alignItems: 'center',
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
  deleteButton: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  bodovicontainer: {
    marginLeft: 20,
    marginBottom: 15,
    borderBottomWidth: 2,
    paddingBottom: 15,
  },
  bodovi: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  noPostsText: {
    fontSize: 16,
    color: '#888',
    marginTop: 20,
    marginLeft: 20,
  },modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  modalText: {
    fontSize: 16,
    marginVertical: 30,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },deleteButtonText2: {
    color: 'red',
    fontSize: 18,
    fontWeight: '600',
  }
});

export default UserInfo;