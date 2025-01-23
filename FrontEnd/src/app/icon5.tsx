import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Modal, Button, ScrollView } from 'react-native';
import BackNav from '../components/Backnav';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getPathWithConventionsCollapsed } from 'expo-router/build/fork/getPathFromState-forks';

const NotificationsPage = () => {
  const [posts, setPosts] = useState([{
    "id": 1,
    "content": "Dobrodosli",
    "userid": 1,
    "likes": []

  }]);
  const [newPost, setNewPost] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [likesModalVisible, setLikesModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [logged, setLogged] = useState(false);

  const config = require('../../config.json');
  const ip = config.ipAddress;

  const getPosts = async() =>{

    try{
      console.log("sta")
      const response = await axios.get(`http://${ip}:8080/v4/api`)
      console.log("odgovoreno")
      setPosts(response.data)
      console.log(response.data)
    }catch(error){
      console.log(error)
    }
  }
  useEffect(()=>{getPosts()}, [])


  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <Text style={styles.profileText}>{item.profile}</Text>
      <Text style={styles.postText}>{item.content}</Text>
      <View style={styles.likeContainer}>
        <TouchableOpacity onPress={() => console.log("liked")} style={styles.likeButton}>
          <MaterialCommunityIcons
            name={item.liked ? 'heart' : 'heart-outline'}
            size={24}
            color={item.liked ? 'red' : '#aaa'}
          />
        </TouchableOpacity>
        <Text style={styles.likesCount}>{item.likes}</Text>
      </View>
    </View>
  );

  
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

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPost}
        contentContainerStyle={styles.postsList}
      />

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
  postContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  profileText: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 5,
  },
  postText: {
    fontSize: 16,
    marginBottom: 5,
  },
  likeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  likeButton: {
    marginRight: 10,
  },
  likesCount: {
    fontSize: 16,
    color: '#555',
  },
  seeLikesContainer: {
    marginLeft: 5,
  },
  seeLikesText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#aaa',
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
  likesModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  likesModalContent: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  likesCountText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
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
});

export default NotificationsPage;
