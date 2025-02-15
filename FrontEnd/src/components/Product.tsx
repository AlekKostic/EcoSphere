import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, Animated, Dimensions, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import ExtendedProduct from './ExtendedProduct';
import Icon from './Icon';

const { height } = Dimensions.get('window'); 

interface Product {
  product_id: number;
  name: string;
  description: string;
  price: number;
  phone_number: string;
  path: string;
  user_id: number;
  broj_pregleda: number;
  saved: boolean;
}
interface ProductProps {
  item: Product;
  dark: boolean;
  savePost: (item: Product) => void;
  personal?: boolean; 
  deleteProd?: (item: number) => void; 
}

const Productt: React.FC<ProductProps> = ({ item, dark, savePost, personal= false, deleteProd=null }) => {
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
    setUserImage(res.data.profile_picture);
  }

  useEffect(() => { getUser(); }, []);

  const handlePressDetails = async () => {
    await axios.put(`http://${ip}:8080/v5/api/${item.product_id}`);
    setCnt(cnt + 1);
    setShowModal(true); 
    Animated.spring(modalAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  const viewCount = item.broj_pregleda;

  const closeModal = () => {
    setShowModal(false);
    Animated.spring(modalAnim, { toValue: 0, useNativeDriver: true }).start(); 
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

  const prod = [item]

  return (<>
    <View style={[styles.productContainer, { backgroundColor: dark ? '#2f6d8c' : '#fff' }]}>
      <View style={styles.iconContainer}>
        {personal && (
          <TouchableOpacity onPress={() => { 
            if (deleteProd) {
              deleteProd(item.product_id);
            }
          }}>
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
        <Text style={[styles.productDescription, { color: dark ? 'white' : "#124460" }]}>
          {item.description.length > 25 ? item.description.slice(0, 25) + '...' : item.description}
        </Text>
        
        <View style={styles.viewSection}>
          <MaterialIcons name="visibility" size={20} color={dark ? 'white' : "#124460"} />
          <Text style={[styles.viewCountText, { color: dark ? 'white' : "#124460" }]}>{cnt}</Text>
        </View>
      </View>
      
      <TouchableOpacity onPress={handlePressDetails} style={styles.footer}>
        <Text style={[styles.viewDetailsText, { color: dark ? 'white' : "#124460" }]}>Pogledajte više</Text>
      </TouchableOpacity>
      
      
    </View>

    <Modal
  visible={showModal}
  animationType="none"
  transparent={true}
  onRequestClose={closeModal}
>
  <View style={styles.modalBackground}>
    <Animated.View
      style={[
        styles.modalContainer,
        { transform: [{ translateY: modalAnim.interpolate({ inputRange: [0, 1], outputRange: [500, 0] }) }] }
      ]}
    >
      <View style={[styles.modalContainer, { backgroundColor: dark ? '#124460' : 'white' }]}>
        
        <View style={styles.closeModalButton}>
          <TouchableOpacity onPress={closeModal}>
            <MaterialIcons name="close" size={30} color={dark ? 'white' : '#124460'} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View>
          {prod.map((product, index) => {
            return (
              <ExtendedProduct 
                  key={product.product_id ? product.product_id.toString() : `fallback-${index}`}
                  item={product} 
                  dark={dark}
                  ime={ime} 
                  prezime={prezime} 
                  profileImageSource={profileImageSource}
                  handleUser={handleUser} 
                />

            );
          })}
          </View>
        </ScrollView>

      </View>
        
    </Animated.View>
  </View>
</Modal>

    </>
  );
};

const styles = StyleSheet.create({
  productContainer: {
    marginTop: 10,
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
    marginVertical:8,
    marginRight: 20,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    marginTop:5,
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
    marginTop:20,
    bottom: 10,
    right: 15,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalContainer: {
    width: '100%',
    height: height * 0.7,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  iconContainer: {
    position: 'absolute',
    top: 15,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center', 
    zIndex: 1,
    paddingHorizontal: 10,
  }, closeModalButton:{
    marginTop:20,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginRight:20,
  },userSection: {
    flexDirection: 'row', 
    alignItems: 'center',  
    marginTop: 10,         
    marginLeft: 30, 
  },
  profilePic: {
    height: 50,
    width: 50,
    borderRadius: 50,
    borderWidth:1,
    borderColor:'#124460'
  },
  userName: {
    marginLeft:10,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  }, contact:{
    marginTop:15,
    fontSize:18,
    marginLeft:30,
    fontWeight: '400',
    marginBottom:20,
  },modalImage: {
    width:'80%',
    height:'80%',
    alignSelf:'center'
  },modalTitle: {
    alignSelf:'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop:20,
    marginBottom: 20,
  },
  modalDescription: {
    paddingHorizontal:30,
    fontSize: 16,
    marginBottom: 20,
  },
  
  
});


export default Productt;
