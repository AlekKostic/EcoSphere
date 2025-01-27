import React, { useEffect, useState } from 'react';
import { 
  View, Text, TextInput, FlatList, TouchableOpacity, 
  StyleSheet, Modal, Button, ActivityIndicator 
} from 'react-native';
import BackNav from '../components/Backnav';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import Post from '../components/Post';

const NotificationsPage = () => {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [logged, setLogged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(false); 

  const config = require('../../config.json');
  const ip = config.ipAddress;

  const getPosts = async () => {
    try {
      setLoading(true);
  
      const value = await AsyncStorage.getItem('userInfo');
      const userInfo = value ? JSON.parse(value) : null;
      const userId = userInfo?.userId;
      const isLogged = !!userId; 
  
      setLogged(isLogged);
  
      const response = await axios.get(`http://${ip}:8080/v4/api`);
      const fetchedPosts = response.data;
  
      let dictionary = {};
      if (isLogged) {
        const response2 = await axios.get(`http://${ip}:8080/v4/api/user/${userId}`);
        response2.data.forEach(item => {
          if(item.postovis)dictionary[item.postovis.id] = true;
        });
      }
  
      const authorsResponses = await Promise.all(
        fetchedPosts.map(post =>
          axios.get(`http://${ip}:8080/v1/api/${post.authorId}`)
            .then(res => res.data)
            .catch(() => ({ ime: "Nepoznato", prezime: "" }))
        )
      );
  
      const postsWithAuthors = fetchedPosts.map((post, index) => ({
        ...post,
        author: authorsResponses[index],
        likes: isLogged ? !!dictionary[post.id] : false,
      }));
  
      setPosts(postsWithAuthors.reverse());
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    getPosts();
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

  const likePost = async (item) => {
    if (!logged) {
      router.push('/Login');
      return;
    }

    if (!item.likes) {
      item.likes = true;
      const value = await AsyncStorage.getItem('userInfo');
      const userInfo = value ? JSON.parse(value) : null;
      const userId = userInfo?.userId;

      try {
        const response = await axios.post(`http://${ip}:8080/v4/api/like`, {
          "user_id": userId,
          "post_id": item.id
        });

        getPosts();
      } catch (error) {
        console.log(error);
      }
    } else {
      item.likes = false;
      const value = await AsyncStorage.getItem('userInfo');
      const userInfo = value ? JSON.parse(value) : null;
      const userId = userInfo?.userId;

      try {
        const response = await axios.put(`http://${ip}:8080/v4/api/unlike`, {
          "user_id": userId,
          "post_id": item.id
        });

        getPosts();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const addPost = async () => {
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      const parsedUserInfo = JSON.parse(userInfo);

      const response = await axios.post(`http://${ip}:8080/v4/api/create`, {
        "context": newPost,
        "user_id": parsedUserInfo.userId
      });

      const newPostData = response.data;

      const authorResponse = await axios.get(`http://${ip}:8080/v1/api/${parsedUserInfo.userId}`);
      const authorData = authorResponse.data;

      const newPostWithAuthor = {
        ...newPostData,
        author: authorData
      };

      setPosts(prevPosts => [newPostWithAuthor, ...prevPosts]);
      setNewPost("");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error in API request:", error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: dark ? '#124460' : 'white' }]}>
      <View style={styles.headerContainer}>
        <BackNav />
        <Text style={[styles.heading, { color: dark ? 'white' : '#124460' }]}>Oglasna tabla</Text>
        <Text style={[styles.subheading, { color: dark ? 'white' : '#124660', borderBottomColor: dark ? '#fff' : '#124460' }]}>
          Ovde možete pročitati i podeliti obaveštenja o dešavanjima vezanim za životnu
          sredinu koji mogu biti korisni i koje treba da vidi što veći broj ljudi.

        </Text>
      </View>

      {logged && (
        <TouchableOpacity
          style={[styles.addPostButton, { backgroundColor: dark ? '#6ac17f' : '#6ac17f' }]}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.addPostButtonText}>+ Dodaj objavu</Text>
        </TouchableOpacity>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={dark ? 'white':'#124460'} />
          <Text style={[styles.loadingText, {color: dark ? 'white':'#124460'}]}>Učitavanje objava...</Text>
        </View>
      ) : (
        <>
          {posts.length === 0 && <Text style={[styles.noPostsText, { color: dark ? 'white' : '#888' }]}>Budite prvi da objavite!</Text>}
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <Post item={item} likePost={likePost} />}
            contentContainerStyle={[styles.postsList, {backgroundColor: dark ? '#1b5975' : '#fff',}]}
          />
        </>
      )}

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={[styles.modalContainer]}>
          <View style={[styles.modalContent, {backgroundColor: dark?'#124460':'white'}]}>
            <Text style={[styles.modalTitle, { color: dark ? 'white' : '#124460'
             }]}>Nova objava</Text>
            <TextInput
              style={[styles.input, { backgroundColor: dark ? 'white' : '#fff', 
                color: dark ? '#124460' : '#124460',
                borderColor: '#124460' }]}
              placeholder="Unesite tekst objave..."
              placeholderTextColor={dark ? '#124460' : '#124460'}
              value={newPost}
              onChangeText={setNewPost}
            />
            <View style={styles.modalActions}>
            <TouchableOpacity onPress={addPost}>
              <Text style={[styles.deleteButtonText2, , {color: dark?'#6ac17f':'#6ac17f'}]}>Dodaj</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setNewPost(""),setIsModalVisible(false)}}>
              <Text style={[styles.cancelButtonText, {color: dark?'white':'#124460'}]}>Otkaži</Text>
            </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
    marginVertical: 10,
  },
  subheading: {
    fontSize: 20,
    textAlign: 'center',
    color: '#555',
    marginBottom: 10,
    paddingBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor:'#124460',
  },
  postsList: {
    paddingBottom: 10,
    borderRadius:5,
  },
  addPostButton: {
    width: '40%',
    marginLeft: '30%',
    backgroundColor: '#007BFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  addPostButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    marginRight: 'auto',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',

  },
  noPostsText: {
    fontSize: 16,
    color: '#888',
    marginTop: 20,
    marginLeft: 20,
  },deleteButtonText2: {

    fontSize: 18,
    fontWeight: '600',
  }, cancelButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },modalActions: {
    marginTop:20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});


export default NotificationsPage;
