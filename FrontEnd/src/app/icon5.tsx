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

  const config = require('../../config.json');
  const ip = config.ipAddress;

  const getPosts = async () => {
    try {
      setLoading(true); 
      const response = await axios.get(`http://${ip}:8080/v4/api`);
      const fetchedPosts = response.data;

      console.log("Fetched posts:", fetchedPosts); 
      const authorsResponses = await Promise.all(
        fetchedPosts.map(post =>
          axios.get(`http://${ip}:8080/v1/api/${post.authorId}`)
            .then(res => res.data) 
            .catch(() => ({ ime: "Nepoznato", prezime: "" }))         )
      );
      const postsWithAuthors = fetchedPosts.map((post, index) => ({
        ...post,
        author: authorsResponses[index]
      }));

      console.log("Posts with authors:", postsWithAuthors);

      setPosts(postsWithAuthors.reverse()); 
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }

    const value = await AsyncStorage.getItem('userInfo');
    if (value !== null) {
      setLogged(true);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  const likePost = (item) => {
    if (!logged) {
      router.push('/Login');
    }
  };

  const addPost = async () => {
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      const parsedUserInfo = JSON.parse(userInfo);
  
      const response = await axios.post(`http://${ip}:8080/v4/api/create`, {
        "context": newPost, 
        "user_id": parsedUserInfo.id
      });
  
      const newPostData = response.data;
      const authorResponse = await axios.get(`http://${ip}:8080/v1/api/${parsedUserInfo.id}`);
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
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <BackNav />
        <Text style={styles.heading}>Oglasna tabla</Text>
        <Text style={styles.subheading}>
          Ovde možete podeliti obaveštenja o dešavanjima vezanim za životnu
          sredinu za koje smatrate da treba da vidi što veći broj ljudi.
        </Text>
      </View>

      {logged && (
        <TouchableOpacity
          style={styles.addPostButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.addPostButtonText}>+ Dodaj objavu</Text>
        </TouchableOpacity>
      )}

      {loading ? ( 
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>Učitavanje objava...</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <Post item={item} likePost={likePost} />}
          contentContainerStyle={styles.postsList}
        />
      )}

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova objava</Text>
            <TextInput
              style={styles.input}
              placeholder="Unesite tekst objave..."
              placeholderTextColor="#ccc"
              value={newPost}
              onChangeText={setNewPost}
            />
            <Button title="Dodaj" onPress={addPost} />
            <Button title="Otkaži" color="red" onPress={() => setIsModalVisible(false)} />
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
  },
  postsList: {
    paddingBottom: 20,
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
    color: '#555',
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
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
});

export default NotificationsPage;
