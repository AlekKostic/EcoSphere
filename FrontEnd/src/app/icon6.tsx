import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Modal, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Za Expo
import BackNav from '../components/Backnav';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import RNFS from 'react-native-fs';

const ProductsPage = () => {
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
    try {
      const response = await axios.post(`http://${ip}:8080/v5/api/create`, {
        "name": name,
        "description": description,
        "price": price,
        "phoneNumber": phoneNumber,
        "path": path
      });

      

      console.log(response.data)
    } catch (error) {
      console.log(error);
    }
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

  const renderProduct = ({ item }) => {
    return (
      <View style={styles.productContainer}>
        {item.image && <Image source={{ uri: item.image }} style={styles.productImage} />}
        <View style={styles.productDetails}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>{item.price}</Text>
          <Text style={styles.productDescription}>{item.description}</Text>
          <TouchableOpacity onPress={() => router.push({ pathname: '/UserInfo' })}>
            <Text style={styles.productOwner}>Prodavac:</Text>
          </TouchableOpacity>
          <Text style={styles.productPhone}>Kontakt: {item.phoneNumber}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <BackNav />
        <Text style={styles.heading}>Prodavnica</Text>
        <Text style={styles.subheading}>
          Ovde možete podeliti proizvode koje želite da ponudite drugim korisnicima.
        </Text>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Pretraži proizvode..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {logged && (
        <TouchableOpacity
          style={styles.addProductButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.addProductButtonText}>+ Dodaj proizvod</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.product_id.toString()}
        renderItem={renderProduct}
        contentContainerStyle={styles.productsList}
      />

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Dodaj novi proizvod</Text>
            <TextInput
              style={styles.input}
              placeholder="Ime proizvoda"
              value={name}
              placeholderTextColor="black"
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Cena proizvoda"
              value={price}
              placeholderTextColor="black"
              onChangeText={setPrice}
            />
            <TextInput
              style={styles.input}
              placeholder="Opis proizvoda"
              placeholderTextColor="black"
              value={description}
              onChangeText={setDescription}
            />
            <TextInput
              style={styles.input}
              placeholder="Broj telefona"
              placeholderTextColor="black"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
              <Text style={styles.imagePickerButtonText}>Izaberi sliku proizvoda</Text>
            </TouchableOpacity>
            {path && <Image source={{ uri: path }} style={styles.previewImage} />}
            <Button title="Dodaj" onPress={addProduct} />
            <Button title="Otkaži" color="red" onPress={closeModal} />
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
  productsList: {
    paddingBottom: 20,
  },
  productContainer: {
    backgroundColor: '#fff',
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 250,  // Veća slika, slično Instagram objavi
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
  productOwner: {
    textDecorationLine: "underline",
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPhone: {
    fontSize: 14,
    color: '#555',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  addProductButton: {
    width: '50%',
    marginLeft: '25%',
    backgroundColor: '#007BFF',
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
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
  },
  imagePickerButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  imagePickerButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  previewImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default ProductsPage;
