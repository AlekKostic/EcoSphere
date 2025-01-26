import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, Image } from 'react-native';
import React, { useState } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';

const Post = ({ item, likePost, index, personal=false, handleDelete }) => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [likedUsers, setLikedUsers] = useState([]);
  const config = require('../../config.json');
  const ip = config.ipAddress;

  const onAuthorPress = () => {
    console.log("Clicked on author:", item);
    router.push({
      pathname: '/UserInfo',
      params: { id: item.author.user_id },
    });
  };

  const onSeeLikesPress = async () => {
    const users = new Set(item.likedIds);
  
    const userDetails = [];
    for (const value of users) {
      const odg = await axios.get(`http://${ip}:8080/v1/api/${value}`);
  
      // Determine the profile image for the liked user
      const imageId = value % 6 + 1; // Dynamically set image ID based on liked user ID
      let profileImageSource = require('../img/profilna6.png');
  
      if (imageId === 1) profileImageSource = require('../img/profilna1.png');
      else if (imageId === 2) profileImageSource = require('../img/profilna2.png');
      else if (imageId === 3) profileImageSource = require('../img/profilna3.png');
      else if (imageId === 4) profileImageSource = require('../img/profilna4.png');
      else if (imageId === 5) profileImageSource = require('../img/profilna5.png');
  
      userDetails.push({
        ime: odg.data.ime,
        prezime: odg.data.prezime,
        id: value,
        profileImage: profileImageSource, // Add profile image for the liked user
      });
    }
    setLikedUsers(userDetails);
    setModalVisible(true); // Show modal
  };
  
  

  const onUserPress = (user) => {
    console.log(user.id);
    router.push({
      pathname: '/UserInfo',
      params: { id: user.id },
    });
  };
  
  

  const imageId = item.authorId % 6 + 1;
  let profileImageSource = require('../img/profilna6.png');

  if(imageId==1)profileImageSource = require('../img/profilna1.png')
  else if(imageId==2)profileImageSource = require('../img/profilna2.png')
  else if(imageId==3)profileImageSource = require('../img/profilna3.png')
  else if(imageId==4)profileImageSource = require('../img/profilna4.png')
  else if(imageId==5)profileImageSource = require('../img/profilna5.png')

  return (
    <View style={styles.postContainer}>
      <View style={styles.infoContainer}>
      
      <TouchableOpacity onPress={onAuthorPress} style={styles.authorContainer} disabled={personal}>
        <Image
          source={profileImageSource} 
          style={styles.profileImage}
        />
        <Text style={styles.profileText}>{item.author.ime + " " + item.author.prezime}</Text>
      </TouchableOpacity>
        {personal && (
          <View style={styles.trashc}>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Ionicons name="trash-outline" size={24} color="gray" />
            </TouchableOpacity>
          </View>
        )}
         </View>
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
              // Rendering liked users in the modal
              <FlatList
              data={likedUsers}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => onUserPress(item)} style={styles.modalUserContainer}>
                  <Image
                    source={item.profileImage} // Use the dynamically set profile image
                    style={styles.modalProfileImage}
                  />
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
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 50,
    marginRight: 10,
  },
  profileText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  postText: {
    fontSize: 16,
    marginBottom: 5,
    marginLeft: 5,
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
    alignItems: 'center',
  },
  modalProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 50,
    marginRight: 10,
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
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // This ensures the trash icon is on the right
  },
  trashc: {
    marginLeft: 'auto', // This pushes the trash can to the far right
  },
});


export default Post;
