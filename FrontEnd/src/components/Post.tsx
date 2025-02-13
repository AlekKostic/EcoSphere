import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, Image, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Post = ({ item, likePost, index, personal = false, handleDelete, handleEdit }) => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [likedUsers, setLikedUsers] = useState([]);
  const config = require('../../config.json');
  const ip = config.ipAddress;

  const [dark, setDark] = useState(false); 
  const [logId, setLogId] = useState(-1); 
  const [editable, setEditable] = useState(false)
  const [editingPost, setEditingPost] = useState(false)

  const getEdit = async()=>{

    const userInfo = await AsyncStorage.getItem('userInfo');
    const parsedUserInfo = JSON.parse(userInfo);

    if (parsedUserInfo.userId===item.author.user_id)
    {
      setEditable(true);
    }

  }

  const getMode = async () => {


    const storedMode = await AsyncStorage.getItem('darkMode');
    if (storedMode === 'true') {
      setDark(true);
    } else {
      setDark(false);
    }

  };


    useEffect(() => {
        getEdit()
   }, []);


  useEffect(() => {
    getMode();
  }, []);


  const onAuthorPress = () => {
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
  
      let profileImageSource = require('../img/profilna6.png');
  
      const imageId = value % 6 + 1;
      if (imageId === 1) profileImageSource = require('../img/profilna1.png');
      else if (imageId === 2) profileImageSource = require('../img/profilna2.png');
      else if (imageId === 3) profileImageSource = require('../img/profilna3.png');
      else if (imageId === 4) profileImageSource = require('../img/profilna4.png');
      else if (imageId === 5) profileImageSource = require('../img/profilna5.png');
  
      userDetails.push({
        ime: odg.data.ime,
        prezime: odg.data.prezime,
        id: value,
        profileImage: profileImageSource, 
      });
    }
    setLikedUsers(userDetails);
    setModalVisible(true);
  };

  const onUserPress = (user) => {
    router.push({
      pathname: '/UserInfo',
      params: { id: user.id },
    });
  };

  const edit = async()=> {
    handleEdit(item)
  }

  const imageId = item.author.user_id % 6 + 1;
  let profileImageSource = require('../img/profilna6.png');
  if (imageId == 1) profileImageSource = require('../img/profilna1.png');
  else if (imageId == 2) profileImageSource = require('../img/profilna2.png');
  else if (imageId == 3) profileImageSource = require('../img/profilna3.png');
  else if (imageId == 4) profileImageSource = require('../img/profilna4.png');
  else if (imageId == 5) profileImageSource = require('../img/profilna5.png');

  

  return (
  <View style={[styles.postContainer, {backgroundColor: dark ? '#2f6d8c' : '#fff'} ]}>
      <View style={styles.infoContainer}>
        <TouchableOpacity onPress={onAuthorPress} style={styles.authorContainer} disabled={personal}>
          <Image source={profileImageSource} style={styles.profileImage} />
          <Text style={[styles.profileText, { color: dark ? 'white' : '#124460' }]}>{item.author.ime + " " + item.author.prezime}</Text>
        </TouchableOpacity>

        <View style={styles.iconContainer}>

        {editable && (
          <View style={styles.iconButton}>
            <TouchableOpacity onPress={() => { edit(); }}>
              <FontAwesome6 name="pencil" size={20} color={dark ? 'white' : '#124460'} />
            </TouchableOpacity>

          </View>
        )}
        {personal && (
          <View style={styles.iconButton}>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Ionicons name="trash-outline" size={24} color={dark ? 'white' : '#124460'} />
            </TouchableOpacity>
          </View>
        )}
        </View>

      </View>
    
          <Text style={[styles.postText, { color: dark ? 'white' : '#124460' }]}>
            {item.content}
          </Text>

      <View style={styles.likeContainer}>
        <TouchableOpacity onPress={() => likePost(item)} style={styles.likeButton}>
          <MaterialCommunityIcons
            name={item.likes ? 'heart' : 'heart-outline'}
            size={24}
            color={item.likes ? '#9a2626' : (dark ? '#ccc' : '#124460')}
          />
        </TouchableOpacity>
        <Text style={[styles.likesCount, { color: dark ? '#ccc' : '#124460' }]}>{new Set(item.likedIds).size}</Text>
        <TouchableOpacity onPress={onSeeLikesPress} style={styles.seeLikesContainer}>
          <Text style={[styles.seeLikesText, { color: dark ? '#ccc' : '#124460', textDecorationLine: 'underline' }]}>Pogledaj svidjanja</Text>
        </TouchableOpacity>
      </View>

      <Modal transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: dark ? '#2c3e50' : '#fff' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: dark ? '#fff' : '#124460' }]}>Ukupno sviđanja: {new Set(item.likedIds).size}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <MaterialCommunityIcons name="close" size={24} color={dark ? 'white' : '#333'} />
              </TouchableOpacity>
            </View>
            {likedUsers.length === 0 ? (
              <Text style={[styles.noLikesText, { color: dark ? '#ccc' : '#aaa' }]}>Nema lajkova</Text>
            ) : (
              <FlatList
                data={likedUsers.toReversed()}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => onUserPress(item)} style={[styles.modalUserContainer, {backgroundColor: dark? '#124460': '#d3d3d3'}]}>
                    <Image source={item.profileImage} style={styles.modalProfileImage} />
                    <Text style={[styles.modalUserText, { color: dark ? '#ccc' : '#333' }]}>{item.ime} {item.prezime}</Text>
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
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,backgroundColor: 'red',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
    marginTop:5,
    marginBottom: 10,
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
  },
  seeLikesContainer: {
    marginLeft: 10,
  },
  seeLikesText: {
    fontSize: 14,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    padding: 40,
    borderRadius: 10,
    width: '100%',
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  closeButton: {
    padding: 5,
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
  },
  noLikesText: {
    fontSize: 16,
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto', 
  },
  iconButton: {
    marginLeft: 10, 
  },
  
});

export default Post;
