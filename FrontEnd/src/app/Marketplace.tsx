import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Modal, Button, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; 
import BackNav from '../components/Backnav';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import Product from '../components/Product';
import { MaterialIcons } from '@expo/vector-icons'; 

const ProductsPage = () => {
  const [dark, setDark] = useState(false); 

  useEffect(() => {
    const getMode = async () => {
      const storedMode = await AsyncStorage.getItem('darkMode');
      setDark(storedMode === 'true');
    };

    getMode();
  }, []);

  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [path, setPath] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const router = useRouter(); 

  const config = require('../../config.json');
  const ip = config.ipAddress;

  const [logged, setLogged] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const check = async () => {
    const userInfo = await AsyncStorage.getItem('userInfo');
    setLogged(!!userInfo);
  
    try {
      const response = await axios.get(`http://${ip}:8080/v5/api`);
      let productsData = response.data.reverse();
  
      if (userInfo) {
        const parsedUserInfo = JSON.parse(userInfo);
        const userId = parsedUserInfo.userId;

        const savedResponse = await axios.get(`http://${ip}:8080/v1/api/${userId}`);

        console.log(savedResponse.data)
        const savedProducts = savedResponse.data.sacuvaniProductids;
        console.log(savedProducts)
        console.log(productsData)
  
        productsData = productsData.map((product) => {
          const isSaved = savedProducts.includes(product.product_id);
          
          console.log(`Product ID: ${product.product_id}, Saved: ${isSaved}`);
        
          return {
            ...product,
            saved: isSaved, 
          };
        });

      } else {
        productsData = productsData.map((product) => ({
          ...product,
          saved: false,
        }));
      }
      console.log(productsData)
      setProducts(productsData);
    } catch (error) {
      console.log(error);
    }
  };

  const savePost = async(item) => {
    console.log(item);

    if (!logged) {
      router.push('/Login');
      return;
    }
  
    const userInfo = await AsyncStorage.getItem('userInfo');
    const userId = userInfo ? JSON.parse(userInfo).userId : null;

    const newSaveStatus = !item.saved;
    console.log(newSaveStatus)

    setProducts((prevPosts) =>
      prevPosts.map((post) =>
        post.product_id === item.product_id ? {
          ...post,
          saved: newSaveStatus
        } : post
      )
    );

    try {
      if (newSaveStatus) {
        await axios.put(`http://${ip}:8080/v5/api/save`, {
          "user_id": userId,
          "product_id": item.product_id,
        });
      } else {
        await axios.put(`http://${ip}:8080/v5/api/unsave`, {
          "user_id": userId,
          "product_id": item.product_id,
        });
      }
    } catch (error) {
      console.error(error);
      setProducts((prevPosts) =>
        prevPosts.map((post) =>
          post.product_id === item.product_id ? {
            ...post,
            saved: post.saved ? false : newSaveStatus 
          } : post
        )
      );
      
    }
    

    return;
    
  };

  useEffect(() => {
    check();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPath(result.assets[0].uri);
    }
  };

  const addProduct = async () => {
    if (!name || !description || !phoneNumber) {
      setErrorMessage('Molimo vas da popunite sva polja'); 
      return;
    }

    try {

      const userInfo = await AsyncStorage.getItem('userInfo');
      const parsedUserInfo = JSON.parse(userInfo);

      const response = await axios.post(`http://${ip}:8080/v5/api/create`, {
        "name": name,
        "description": description,
        "price": 0,
        "phone_number": phoneNumber,
        "path": null,
        "user_id": parsedUserInfo.userId,
        "broj_pregleda": 0
      });

      console.log('Product added successfully:', response.data);
      setIsModalVisible(false);
      console.log(response.broj_pregleda)

      const newPost = {
        "product_id": response.data.product_id,
        "name": name,
        "description": description,
        "price": 0,
        "phone_number": phoneNumber,
        "path": null,
        "user_id": parsedUserInfo.userId,
        "broj_pregleda": 0,
        "saved":false
      }

      console.log(products)

      setProducts([newPost, ...products])
    } catch (error) {
      console.log('Error adding product:', error);
    }
  };

  const renderProduct = ({ item }) => {
    return (
      <TouchableOpacity>
      <Product item={item} dark={dark} savePost={savePost}/>
      </TouchableOpacity>
    );
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setName('');
    setDescription('');
    setPrice(0);
    setPhoneNumber('');
    setPath('');
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const checkImageExists = async ({ path }) => {
    const fileInfo = await FileSystem.getInfoAsync(path);
    if (fileInfo.exists) {
      alert('Image exists at the path: ' + path);
    } else {
      alert('Image does not exist at the path');
    }
  };

  const inputRef = useRef(null);  // Define the inputRef

  const handleSearchIconPress = () => {
    if (isKeyboardVisible) {
      Keyboard.dismiss();
    } else {
      inputRef.current?.focus();  // Focus on the input field
    }
    setIsKeyboardVisible(!isKeyboardVisible);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={[styles.container, { backgroundColor: dark ? '#124460' : 'white' }]}>
        <View style={styles.headerContainer}>
          <BackNav />
          <Text style={[styles.heading, { color: dark ? 'white' : '#124460' }]}>Prodavnica</Text>
          <Text style={[styles.subheading, { color: dark ? 'white' : '#124460', borderBottomColor: dark ? 'white' : '#124460' }]}>
            Ovde možete podeliti proizvode koje želite da poklonite drugim korisnicima,
            kao i da pogledate koje to proizvode drugi korisnici poklanjaju.
          </Text>
        </View>
    
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            ref={inputRef}  // Attach the inputRef to TextInput
            style={[styles.searchInput, { backgroundColor: dark ? 'white' : 'white', borderColor: dark ? 'white' : '#124460' }]}
            placeholderTextColor={dark ? '#124460' : '#124460'}
            placeholder="Pretraži proizvode..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsKeyboardVisible(true)}
            onBlur={() => setIsKeyboardVisible(false)}
          />
          <TouchableOpacity style={styles.searchIcon} onPress={handleSearchIconPress}>
            <MaterialIcons name="search" size={24} color={dark ? '#124460' : '#124460'} />
          </TouchableOpacity>
        </View>
    
        {/* Add Product Button */}
        <TouchableOpacity
          style={styles.addProductButton}
          onPress={() => { if (!logged) router.push('/Login'); else setIsModalVisible(true); }}
        >
          <Text style={styles.addProductButtonText}>+ Dodaj proizvod</Text>
        </TouchableOpacity>
    
        {/* Product List */}
        {products.length === 0 ? (
          <Text style={[styles.noProductsText, { color: dark ? 'white' : '#124460' }]}>Objavite prvi proizvod!</Text>
        ) : filteredProducts.length === 0 ? (
          <Text style={[styles.noProductsText, { color: dark ? 'white' : '#124460' }]}>Nema proizvoda koji odgovaraju pretrazi!</Text>
        ) : (
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.product_id.toString()}
            renderItem={renderProduct}
            contentContainerStyle={styles.productsList}
          />
        )}
    
        {/* Modal for Adding Product */}
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { backgroundColor: dark ? '#124460' : 'white' }]}>
              <Text style={[styles.modalTitle, { color: dark ? 'white' : '#124460' }]}>Dodaj novi proizvod</Text>
              {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
              <TextInput
                style={[styles.input, { backgroundColor: dark ? 'white' : '#fff', color: dark ? '#124460' : '#124460', borderColor: '#124460' }]}
                placeholder="Ime proizvoda"
                value={name}
                placeholderTextColor="#124460"
                onChangeText={setName}
              />
              <TextInput
                style={[styles.input, { backgroundColor: dark ? 'white' : '#fff', color: dark ? '#124460' : '#124460', borderColor: '#124460' }]}
                placeholder="Opis proizvoda"
                placeholderTextColor="#124460"
                value={description}
                onChangeText={setDescription}
              />
              <TextInput
                style={[styles.input, { backgroundColor: dark ? 'white' : '#fff', color: dark ? '#124460' : '#124460', borderColor: '#124460' }]}
                placeholder="Broj telefona"
                placeholderTextColor="#124460"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
              <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                <Text style={styles.imagePickerButtonText}>Izaberi sliku proizvoda</Text>
              </TouchableOpacity>
              {path && <Image source={{ uri: path }} style={styles.previewImage} />}
              <View style={styles.modalActions}>
                <TouchableOpacity onPress={addProduct}>
                  <Text style={[styles.deleteButtonText2, { color: dark ? '#6ac17f' : '#6ac17f' }]}>Dodaj</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={closeModal}>
                  <Text style={[styles.cancelButtonText, { color: dark ? 'white' : '#124460' }]}>Otkaži</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    borderBottomWidth: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6e5e3',
    borderRadius: 10,
    marginBottom: 20,
    width: '70%',
    alignSelf: 'center',
    position: 'relative',
  },
  searchInput: {
    flex: 1,
    height: 45,
    borderRadius: 10,
    paddingLeft: 15,
    fontSize: 16,
    paddingRight: 40,
    borderColor: '#124460',
    borderWidth:1,
  },
  searchIcon: {
    position: 'absolute',
    right: 10,
    padding: 5,
  },
  addProductButton: {
    backgroundColor: '#6ac17f',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '50%',
    alignSelf: 'center',
  },
  addProductButtonText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  noProductsText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 10,
  },
  imagePickerButton: {
    backgroundColor: '#124460',
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  imagePickerButtonText: {
    color: 'white',
  },
  previewImage: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  deleteButtonText2: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6ac17f',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productsList: {
    marginLeft:5,
    marginRight:5,
    marginTop: 20,
  },
});

export default ProductsPage;
