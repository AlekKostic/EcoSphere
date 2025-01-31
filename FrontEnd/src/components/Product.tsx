import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, Animated, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';

const { height } = Dimensions.get('window'); // Dobijamo visinu ekrana

const Product = ({ item, dark, savePost, personal= false, deleteProd=null }) => {
  const router = useRouter();
  
  const [showModal, setShowModal] = useState(false);
  const [modalAnim] = useState(new Animated.Value(0)); 
  const [cnt, setCnt] = useState(item.broj_pregleda);

  const [ime, setIme] = useState("");
  const [prezime, setPrezime] = useState("");
  const [id, setId] = useState(0);
  const [userImage, setUserImage] = useState('');

  const config = require('../../config.json');
  const ip = config.ipAddress;

  const getUser = async () => {
    const res = await axios.get(`http://${ip}:8080/v1/api/${item.user_id}`);
    setIme(res.data.ime);
    setPrezime(res.data.prezime);
    setId(res.data.user_id);
    setUserImage(res.data.profile_picture); // Assuming there is a profile_picture field
  }

  useEffect(() => { getUser() }, []);

  const handlePressDetails = async () => {
    await axios.put(`http://${ip}:8080/v5/api/${item.product_id}`);
    setCnt(cnt + 1);
    setShowModal(true); 
    Animated.spring(modalAnim, { toValue: 1, useNativeDriver: true }).start(); // Animiraj modal
  };

  const viewCount = item.broj_pregleda;

  const closeModal = () => {
    setShowModal(false); // Zatvori modal
    Animated.spring(modalAnim, { toValue: 0, useNativeDriver: true }).start(); // Animiraj povratak
  };

  const handleUser = () => {
    router.push({
      pathname: '/UserInfo',
      params: { id: id },
    });
  }


  const imageId = id % 6 + 1;
  let profileImageSource = require('../img/profilna6.png');
  if (imageId == 1) profileImageSource = require('../img/profilna1.png');
  else if (imageId == 2) profileImageSource = require('../img/profilna2.png');
  else if (imageId == 3) profileImageSource = require('../img/profilna3.png');
  else if (imageId == 4) profileImageSource = require('../img/profilna4.png');
  else if (imageId == 5) profileImageSource = require('../img/profilna5.png');

  return (
    <View style={[styles.productContainer, { backgroundColor: dark ? '#2f6d8c' : '#fff' }]}>
      <View style={styles.iconContainer}>
        {personal && (
          <TouchableOpacity onPress={() => deleteProd(item.product_id)}>
            <Ionicons name="trash-outline" size={22} color={dark ? 'white' : '#124460'} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => { savePost(item) }} style={styles.saveIconContainer}>
          <MaterialIcons
            name={item.saved ? "bookmark" : "bookmark-border"} 
            size={24}
            color={dark ? 'white' : '#124460'}
          />
        </TouchableOpacity>
      </View>

      <Image 
        source={item.path ? { uri: item.path } : require('../img/pathnull.png')} 
        style={styles.productImage} 
      />
      
      <View style={styles.productDetails}>
        <Text style={[styles.productName, { color: dark ? 'white' : "#124460" }]}>{item.name}</Text>
        <Text style={[styles.productDescription, { color: dark ? 'white' : "#124460" }]}>{item.description}</Text>
        
        <View style={styles.viewSection}>
          <Icon name="visibility" size={20} color={dark ? 'white' : "#124460"} />
          <Text style={[styles.viewCountText, { color: dark ? 'white' : "#124460" }]}>{cnt}</Text>
        </View>
      </View>
      
      <TouchableOpacity onPress={handlePressDetails} style={styles.footer}>
        <Text style={[styles.viewDetailsText, { color: dark ? 'white' : "#124460" }]}>Pogledajte detaljnije</Text>
      </TouchableOpacity>
      
      <Modal
        visible={showModal}
        animationType="none"
        transparent={true}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalBackground}>
            <Animated.View
              style={[styles.modalContainer, { transform: [{ translateY: modalAnim.interpolate({ inputRange: [0, 1], outputRange: [500, 0] }) }] }]}>
              <View style={[styles.modalContent, { backgroundColor: dark ? '#2f6d8c' : '#fff' }]}>
                <TouchableOpacity onPress={() => handleUser()} style={styles.userSection}>
                  <Image 
                    source={profileImageSource} // Default image if no profile picture
                    style={styles.profilePic} 
                  />
                  <Text style={[styles.modalTitle, { color: dark ? 'white' : '#124460' }]}>
                    {ime} {prezime}
                  </Text>
                </TouchableOpacity>
                <Text style={[styles.modalDescription, { color: dark ? 'white' : '#124460' }]}>{"Broj telefona:" + item.phone_number}</Text>
                <Image 
                  source={item.path ? { uri: item.path } : require('../img/pathnull.png')}
                  style={styles.modalImage}
                />
                <Text style={[styles.modalTitle, { color: dark ? 'white' : '#124460' }]}>{item.name}</Text>
                <Text style={[styles.modalDescription, { color: dark ? 'white' : '#124460' }]}>{item.description}</Text>
                <TouchableOpacity onPress={closeModal} style={styles.closeModalButton}>
                  <MaterialIcons name="close" size={30} color={dark ? 'white' : '#124460'} />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  productContainer: {
    marginTop:10,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    padding: 15,
    position: 'relative',
  },
  saveIconContainer: {
    left: 5,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 20,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  viewSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewCountText: {
    fontSize: 14,
    marginLeft: 5,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  footer: {
    position: 'absolute',
    bottom: 15,
    right: 15,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalContainer: {
    width: '100%',
    height: height * 0.7,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  modalContent: {
    paddingTop: '15%',
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'relative', 
  },
  modalImage: {
    width: '70%', 
    height: undefined,
    aspectRatio: 1,
    borderRadius: 10,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeModalButton: {
    position: 'absolute',
    top: 15,
    right: 10,
    zIndex: 1, 
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },iconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',  // Aligns icons horizontally
    alignItems: 'center',  // Aligns icons vertically
    zIndex: 1,
    paddingHorizontal: 10, // Adds horizontal space for the icons
  },
});

export default Product;
