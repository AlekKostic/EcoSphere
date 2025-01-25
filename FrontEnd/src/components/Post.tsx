import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import React, { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';

const Post = ({ item, likePost, index }) => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [likedUsers, setLikedUsers] = useState([]);
  const config = require('../../config.json');
  const ip = config.ipAddress;

  const onAuthorPress = (author) => {
    console.log("Clicked on author:", author);
    router.push({
      pathname: '/UserInfo',
      params: { id: item.authorId },
    });
  };

  const onSeeLikesPress = async () => {
    const users = new Set(item.likedIds);
    console.log(users);

    const userDetails = [];
    for (const value of users) {
      const odg = await axios.get(`http://${ip}:8080/v1/api/${value}`);
      console.log(odg.data);

      userDetails.push({ ime: odg.data.ime, prezime: odg.data.prezime, id: value });
    }
    setLikedUsers(userDetails); // Update liked users
    setModalVisible(true); // Show modal
  };

  const onUserPress = (userId) => {
    console.log("Clicked on user:", userId);
    router.push({
      pathname: '/UserInfo',
      params: { id: userId },
    });
  };

  return (
    <View style={styles.postContainer}>

      <TouchableOpacity onPress={onAuthorPress}>
        <Text style={styles.profileText}>{item.author.ime + " " + item.author.prezime}</Text>
      </TouchableOpacity>

      <Text style={styles.postText}>{item.content}</Text>

      <View style={styles.likeContainer}>
        <TouchableOpacity onPress={() => likePost(item)} style={styles.likeButton}>
          <MaterialCommunityIcons
            name={item.likes ? 'heart' : 'heart-outline'}
            size={24}
            color={item.likes ? 'red' : '#aaa'}
          />
        </TouchableOpacity>
        <Text style={styles.likesCount}>{new Set(item.likedIds).size}</Text>
        <TouchableOpacity onPress={onSeeLikesPress} style={styles.seeLikesContainer}>
          <Text style={styles.seeLikesText}>Pogledaj svidjanja</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Likes</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <MaterialCommunityIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            {likedUsers.length === 0 ? (
              <Text style={styles.noLikesText}>Nema lajkova</Text>
            ) : (
              <FlatList
                data={likedUsers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => onUserPress(item.id)} style={styles.modalUserContainer}>
                    <Text style={styles.modalUserText}>{item.ime} {item.prezime}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
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
    marginLeft: 10,
  },
  seeLikesText: {
    fontSize: 14,
    color: '#aaa',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end', // Align modal to the bottom
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 10,
    width: '100%',
    maxHeight: '70%', // Set max height for modal
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  closeButton: {
    padding: 5,
    marginBottom: 25,
  },
  modalUserContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalUserText: {
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
    color: '#333',
  },
  noLikesText: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 20,
    marginBottom:30,
  },
});

export default Post;
