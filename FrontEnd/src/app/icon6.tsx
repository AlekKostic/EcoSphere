import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Modal, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Za Expo
import BackNav from '../components/Backnav';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductsPage = () => {
  const [products, setProducts] = useState([
    {
      id: '1',
      name: 'Proizvod 1',
      price: '1000 RSD',
      description: 'Opis proizvoda 1',
      user_id: { firstName: 'Marko', lastName: 'Marković' },
      broj_telefona: '0601234567',
      image: null,
    },
    {
      id: '2',
      name: 'Proizvod 2',
      price: '2000 RSD',
      description: 'Opis proizvoda 2',
      user_id: { firstName: 'Ana', lastName: 'Anić' },
      broj_telefona: '0612345678',
      image: null,
    },
    {
      id: '3',
      name: 'Proizvod 3',
      price: '1500 RSD',
      description: 'Opis proizvoda 3',
      user_id: { firstName: 'Jovan', lastName: 'Jovanović' },
      broj_telefona: '0623456789',
      image: null,
    },
  ]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    user_id: { firstName: '', lastName: '' },
    broj_telefona: '',
    image: null,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter(); 

  const [logged, setLogged] = useState(false)

  const check = async()=>{
    const userInfo = await AsyncStorage.getItem('userInfo')

    if (userInfo) {
      setLogged(true)
    }
  }

  useEffect(() => {
    check();
  }, []);

  // Funkcija za biranje slike
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setNewProduct({ ...newProduct, image: result.assets[0].uri });
    }
  };

  const addProduct = () => {
    if (
      newProduct.name.trim() &&
      newProduct.price.trim() &&
      newProduct.description.trim() &&
      newProduct.user_id.firstName.trim() &&
      newProduct.user_id.lastName.trim() &&
      newProduct.broj_telefona.trim()
    ) {
      setProducts([ { id: Date.now().toString(), ...newProduct }, ...products ]);
      setNewProduct({
        name: '',
        price: '',
        description: '',
        user_id: { firstName: '', lastName: '' },
        broj_telefona: '',
        image: null,
      });
      setIsModalVisible(false);
    }
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productContainer}>
      {item.image && <Image source={{ uri: item.image }} style={styles.productImage} />}
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>

        <TouchableOpacity
          onPress={() => router.push({ pathname: '/UserInfo'})}
        >
          <Text style={styles.productOwner}>
            Prodavac: {item.user_id.firstName} {item.user_id.lastName}
          </Text>
        </TouchableOpacity>

        <Text style={styles.productPhone}>Kontakt: {item.broj_telefona}</Text>
      </View>
    </View>
  );

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <BackNav />
        <Text style={styles.heading}>Prodavnica</Text>
        <Text style={styles.subheading}>
          Ovde možete podeliti proizvode koje želite da ponudite drugim korisnicima.
        </Text>
      </View>

      {/* Input za pretragu */}
      <TextInput
        style={styles.searchInput}
        placeholder="Pretraži proizvode..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
  {(logged && 
      <TouchableOpacity
        style={styles.addProductButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.addProductButtonText}>+ Dodaj proizvod</Text>
      </TouchableOpacity>
      )}

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        contentContainerStyle={styles.productsList}
      />

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Dodaj novi proizvod</Text>
            <TextInput
              style={styles.input}
              placeholder="Ime proizvoda"
              value={newProduct.name}
              onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Cena proizvoda"
              value={newProduct.price}
              onChangeText={(text) => setNewProduct({ ...newProduct, price: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Opis proizvoda"
              value={newProduct.description}
              onChangeText={(text) => setNewProduct({ ...newProduct, description: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Ime korisnika"
              value={newProduct.user_id.firstName}
              onChangeText={(text) =>
                setNewProduct({
                  ...newProduct,
                  user_id: { ...newProduct.user_id, firstName: text },
                })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Prezime korisnika"
              value={newProduct.user_id.lastName}
              onChangeText={(text) =>
                setNewProduct({
                  ...newProduct,
                  user_id: { ...newProduct.user_id, lastName: text },
                })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Broj telefona"
              value={newProduct.broj_telefona}
              onChangeText={(text) => setNewProduct({ ...newProduct, broj_telefona: text })}
            />
            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
              <Text style={styles.imagePickerButtonText}>Izaberi sliku proizvoda</Text>
            </TouchableOpacity>
            {newProduct.image && (
              <Image source={{ uri: newProduct.image }} style={styles.previewImage} />
            )}
            <Button title="Dodaj" onPress={addProduct} />
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
    width: '40%',
    marginLeft: '30%',
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
