import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Modal, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; 
import BackNav from '../components/Backnav';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
const ProductsPage = () => {

  const [dark, setDark] = useState(false); 

  useEffect(() => {
    const getMode = async () => {
      const storedMode = await AsyncStorage.getItem('darkMode');
      if (storedMode === 'true') {
        setDark(true);
      } else {
        setDark(false);
      }
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
  const router = useRouter(); 

  const config = require('../../config.json');
  const ip = config.ipAddress;

  const [logged, setLogged] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const check = async () => {
    const userInfo = await AsyncStorage.getItem('userInfo');
    if (userInfo) {
      setLogged(true);
    }
    try {
      const response = await axios.get(`http://${ip}:8080/v5/api`);
      setProducts(response.data);
      setProducts((prevPosts) => [...prevPosts].reverse());
    } catch (error) {
      console.log(error);
    }
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
    if (!name || !description || !price || !phoneNumber || !path) {
      setErrorMessage('Molimo vas da popunite sva polja'); 
      return;
    }

    try {
      const response = await axios.post(`http://${ip}:8080/v5/api/create`, {
        name: name,
        description: description,
        price: price,
        phoneNumber: phoneNumber,
        path: path
      });

      console.log('Product added successfully:', response.data);
      setIsModalVisible(false);
      check();
    } catch (error) {
      console.log('Error adding product:', error);
    }
  };

  const renderProduct = ({ item }) => {
    return (
      <View style={[styles.productContainer, {backgroundColor: dark ? '#2f6d8c' : '#fff'}]}>
        {item.path && <Image source={{ uri: item.path }} style={styles.productImage} />}
        <View style={styles.productDetails}>
          <Text style={[styles.productName, {color: dark?'white':"#124460"}]}>{item.name}</Text>
          <Text style={[styles.productDescription, {color: dark?'white':"#124460"}]}>{item.description}</Text>
          <TouchableOpacity onPress={() => router.push({ pathname: '/UserInfo' })}>
            <Text style={[styles.productPhone, {color: dark?'white':"#124460"}]}>Kontakt telefon: {item.phoneNumber}</Text>
          </TouchableOpacity>
        </View>
      </View>
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

  return (
    <View style={[styles.container, {backgroundColor: dark? '#124460': 'white'}]}>
      <View style={styles.headerContainer}>
        <BackNav />
        <Text style={[styles.heading,{color: dark? 'white': '#124460'}]}>Prodavnica</Text>
        <Text style={[styles.subheading, {color: dark? 'white': '#124460', 
          borderBottomColor: dark?'white':'#124460'
        }]}>
          Ovde možete podeliti proizvode koje želite da ponudite drugim korisnicima,
          kao i da pogledate koje to proizvode drugi korisnici nude.
        </Text>
      </View>
  
      <TextInput
        style={[styles.searchInput, {backgroundColor: dark? 'white': 'white',
          borderColor: dark? 'white': '#124460'
        }]}
        placeholderTextColor= { dark? '#124460': '#124460'}
        placeholder="Pretraži proizvode..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
  
      {logged && (
        <TouchableOpacity
          style={styles.addProductButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={[styles.addProductButtonText]}>+ Dodaj proizvod</Text>
        </TouchableOpacity>
      )}
  
      {products.length === 0 ? (
        <Text style={[styles.noProductsText, {color: dark?'white':'#124460'}]}>Objavite prvi proizvod!</Text>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.product_id.toString()}
          renderItem={renderProduct}
          contentContainerStyle={styles.productsList}
        />
      )}
  
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={[styles.modalContainer]}>
          <View style={[styles.modalContent,{backgroundColor: dark?'#124460':'white'}]}>
            <Text style={[styles.modalTitle,{color: dark?'white':'#124460'}]}>Dodaj novi proizvod</Text>
            {errorMessage ? (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            ) : null}
            <TextInput
              style={[styles.input, { backgroundColor: dark ? 'white' : '#fff', 
                color: dark ? '#124460' : '#124460',
                borderColor: '#124460' }]}
              placeholder="Ime proizvoda"
              value={name}
              placeholderTextColor="#124460"
              onChangeText={setName}
            />
            <TextInput
              style={[styles.input, { backgroundColor: dark ? 'white' : '#fff', 
                color: dark ? '#124460' : '#124460',
                borderColor: '#124460' }]}
              placeholder="Cena proizvoda u dinarima"
              value={price}
              placeholderTextColor="#124460"
              onChangeText={setPrice}
            />
            <TextInput
              style={[styles.input, { backgroundColor: dark ? 'white' : '#fff', 
                color: dark ? '#124460' : '#124460',
                borderColor: '#124460' }]}
              placeholder="Opis proizvoda"
              placeholderTextColor="#124460"
              value={description}
              onChangeText={setDescription}
            />
            <TextInput
              style={[styles.input, { backgroundColor: dark ? 'white' : '#fff', 
                color: dark ? '#124460' : '#124460',
                borderColor: '#124460' }]}
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
                          <TouchableOpacity
                            onPress={addProduct}
                          >
                            <Text style={[styles.deleteButtonText2, , {color: dark?'#6ac17f':'#6ac17f'}]}>Dodaj</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={closeModal}
                          >
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
  },
  darkBackground: {
    backgroundColor: '#124460', 
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
  darkText: {
    color: '#fff',
  },
  productsList: {
    paddingTop:10,
    paddingBottom: 20,
    paddingHorizontal:10,
  },
  productContainer: {
    backgroundColor: '#fff',
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  darkProduct: {
    backgroundColor: '#1b5975', 
  },
  productImage: {
    marginTop:5,
    marginLeft:'5%',
    width: '90%',
    height: 250,
    borderRadius: 10,
  },
  productDetails: {
    padding: 15,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  productPhone: {
    fontSize: 14,
    color: '#555',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: '70%',
    marginLeft: '15%',
  },
  darkInput: {
    backgroundColor: '#333',
    color: '#fff',
  },
  addProductButton: {
    width: '50%',
    marginLeft: '25%',
    backgroundColor: '#6ac17f',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  addProductButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  darkModal: {
    backgroundColor: '#333',
  },
  modalTitle: {
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
  },
  imagePickerButton: {
    backgroundColor: '#6ac17f',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  imagePickerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  previewImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  errorMessage: {
    color: '#ff999c',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  noProductsText: {
    fontSize: 16,
    color: '#888',
    marginTop: 20,
    marginLeft: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop:20,
  },
  cancelButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },deleteButtonText2: {

    fontSize: 18,
    fontWeight: '600',
  }
});

export default ProductsPage;
