import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Modal, Button, Image, TouchableWithoutFeedback, Keyboard, ActivityIndicator, StatusBar, Platform, AppState, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; 
import BackNav from '../components/Backnav';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import Productt from '../components/Product';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'; 

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


const ProductsPage = () => {
  const [dark, setDark] = useState(false); 

  const productRef = useRef<FlatList<Product>>(null); 

  useEffect(() => {
    const getMode = async () => {
      const storedMode = await AsyncStorage.getItem('darkMode');
      setDark(storedMode === 'true');
    };

    getMode();
  }, []);
  const [products, setProducts] = useState<Product[]>([]);
const [name, setName] = useState<string>('');
const [description, setDescription] = useState<string>('');
const [price, setPrice] = useState<number>(0);
const [phoneNumber, setPhoneNumber] = useState<string>('');
const [path, setPath] = useState<string | null>(null);
const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
const [searchQuery, setSearchQuery] = useState<string>('');
const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false);
const [loading, setLoading] = useState<boolean>(true);
const [loadingg, setLoadingg] = useState<boolean>(false);
const [tried, setTried] = useState<boolean>(false);
const [logged, setLogged] = useState<boolean>(false);
const [errorMessage, setErrorMessage] = useState<string>('');

const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('default'); 
    } else {
      StatusBar.setBarStyle(dark ? 'light-content' : 'dark-content'); 
      StatusBar.setBackgroundColor(dark ? '#124460' : '#fff'); 
    }

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        if (Platform.OS === 'ios') {
          StatusBar.setBarStyle('default'); 
        } else {
          StatusBar.setBarStyle(dark ? 'light-content' : 'dark-content');
          StatusBar.setBackgroundColor(dark ? '#124460' : '#fff');
        }
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove(); 
    };
  }, [appState, dark]);

  
  const router = useRouter(); 

  const config = require('../../config.json');
  const ip = config.ipAddress;


  const check = async () => {
    const userInfo = await AsyncStorage.getItem('userInfo');
    setLogged(!!userInfo);
  
    try {
      setLoading(true);
      const response = await axios.get(`http://${ip}:8080/v5/api`);
      let productsData = response.data.reverse();
  
      if (userInfo) {
        const parsedUserInfo = JSON.parse(userInfo);
        const userId = parsedUserInfo.userId;

        const savedResponse = await axios.get(`http://${ip}:8080/v1/api/${userId}`);
        
        const savedProducts = savedResponse.data.sacuvaniProductids;
  
        productsData = productsData.map((product: Product) => {

          const isSaved = savedProducts.includes(product.product_id);
          
        
          return {
            ...product,
            saved: isSaved, 
          };
        });

      } else {
        productsData = productsData.map((product: Product) => ({
          ...product,
          saved: false,
        }));
      }
      setProducts(productsData);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const savePost = async(item: Product) => {


    if (!logged) {
      router.push('/Login');
      return;
    }
  
    const userInfo = await AsyncStorage.getItem('userInfo');
    const userId = userInfo ? JSON.parse(userInfo).userId : null;

    const newSaveStatus = !item.saved;

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

  const uploadImage = async (path: string) => {
    try {
      if (!path) {
        return null;
      }
  
  
      const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
      const fileName = `image_${timestamp}.png`;
  
  
      const formData = new FormData();
      formData.append('file', {
        uri: path,
        type: 'image/png',
        name: fileName,
      } as unknown as Blob);
  
      const res = await axios.post(`http://${ip}:8080/s3`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 5000,
      });

      return res.data;
    } catch (axiosError) {
      setLoadingg(false)
      if (axiosError.response && axiosError.response.status === 413){
        setErrorMessage("Priložena slika je prevelika");
        return "1"
      }
      setErrorMessage("Greška prilikom slanja slike na server");
      return null;
    }
  };
  
  
  
  
  
  const addProduct = async () => {
    if (!name || !description || !phoneNumber) {
      setErrorMessage('Molimo vas da popunite sva polja'); 
      return;
    }

  
    if (description.length > 250) {
      setErrorMessage('Opis može imati do 250 karaktera'); 
      return;
    }



    if ((path===null || path===undefined || path==="") && !tried) {
      setTried(true)
      return; 
    }

    setLoadingg(true)
  
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      if(!userInfo)return
      const parsedUserInfo = JSON.parse(userInfo);
      
      const imageUrl = path ? await uploadImage(path) : null;

  
      if (path && !imageUrl) {
        setErrorMessage("Došlo je do greške prilikom dodavanja slike");
        return; 
      }
      if (path && imageUrl==="1") {
        setErrorMessage("Priložena slika je prevelika");
        return; 
      }
      const response = await axios.post(`http://${ip}:8080/v5/api/create`, {
        name: name,
        description: description,
        price: 0,
        phone_number: phoneNumber,
        path: imageUrl, 
        user_id: parsedUserInfo.userId,
        broj_pregleda: 0
      });
  
      setIsModalVisible(false);
  
      const newPost = {
        product_id: response.data.product_id,
        name: name,
        description: description,
        price: 0,
        phone_number: phoneNumber,
        path: imageUrl,
        user_id: parsedUserInfo.userId,
        broj_pregleda: 0,
        saved: false
      };
  
      setTimeout(() => {
        productRef.current?.scrollToOffset({ animated: true, offset: 0 });
      }, 300);
  
      setName("");
      setDescription("");
      setPath(null); 
      setPhoneNumber("");
      setIsKeyboardVisible(false);
      setErrorMessage("");
      setTried(false)
      setLoadingg(false)
  
      setProducts([newPost, ...products]);
  
    } catch (error) {
      setTried(false)
      setLoadingg(false)
      setErrorMessage("Došlo je do greške prilikom dodavanja proizvoda");
    }
  };
  
  

  const renderProduct = ({ item }: { item: Product}) => {
    return (
      <TouchableOpacity onPress={()=>{}}>
      <Productt item={item} dark={dark} savePost={savePost}/>
      </TouchableOpacity>
    );
  };

  const closeModal = () => {
    if(tried){
      setTried(false)
      return
    }
    setIsModalVisible(false);
    setName('');
    setDescription('');
    setPrice(0);
    setPhoneNumber('');
    setPath('');
    setErrorMessage("")
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const inputRef = useRef<TextInput>(null);

  const handleSearchIconPress = () => {
    if (isKeyboardVisible) {
      Keyboard.dismiss();
    } else {
      inputRef.current?.focus(); 
    }
    setIsKeyboardVisible(!isKeyboardVisible);
  };

  return (
    <SafeAreaView style={{flex:1, backgroundColor:dark?'#124460':'white'}}>
    <BackNav />
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={[styles.container, { backgroundColor: dark ? '#124460' : 'white' }]}>
        <View style={styles.headerContainer}>
          <Text style={[styles.heading, { color: dark ? 'white' : '#124460' }]}>Prodavnica</Text>
          <Text style={[styles.subheading, { color: dark ? 'white' : '#124460', borderBottomColor: dark ? 'white' : '#124460' }]}>
            Ovde možete podeliti proizvode koje želite da poklonite drugim korisnicima,
            kao i da pogledate koje to proizvode drugi korisnici poklanjaju.
          </Text>
        </View>
        <View style={[styles.actions,{alignItems:'center', justifyContent:'center'}]}>
        <View style={styles.searchContainer}>
          <TextInput
            ref={inputRef} 
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
  
        <TouchableOpacity
          style={styles.addProductButton}
          onPress={() => { if (!logged) router.push('/Login'); else setIsModalVisible(true); }}
        >
          <Text style={styles.addProductButtonText}>
            <MaterialCommunityIcons name="plus" size={30} color={dark ? 'white' : 'white'} />
          </Text>
        </TouchableOpacity>
        </View>
    
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={dark ? 'white' : '#124460'} />
            <Text style={[styles.loadingText, { color: dark ? 'white' : '#124460' }]}>
              Učitavanje proizvoda...
            </Text>
          </View>
        ) : products.length === 0 ? (
          <Text style={[styles.noProductsText, { color: dark ? 'white' : '#124460' }]}>
            Objavite prvi proizvod!
          </Text>
        ) : filteredProducts.length === 0 ? (
          <Text style={[styles.noProductsText, { color: dark ? 'white' : '#124460' }]}>
            Nema proizvoda koji odgovaraju pretrazi!
          </Text>
        ) : (
          <FlatList
            ref={productRef}
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
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { backgroundColor: dark ? '#124460' : 'white' }]}>
              {loadingg && (
                                <View style={{
                                  position: "absolute",
                                  top: 0, left: 0, right: 0, bottom: 0,
                                  backgroundColor: "rgba(0,0,0,0.3)",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  borderRadius: 10,
                                  zIndex:9999
                                }}>
                                  <ActivityIndicator size="large" color={dark ? "white" : "#124460"} />
                                </View>
                              )}
              <Text style={[styles.modalTitle, { color: dark ? 'white' : '#124460' }]}>
                {tried?"Upozorenje":"Dodaj novi proizvod"}</Text>
              
              {tried && 
              <Text style={[{
                color: dark?'white':'#124460',
                marginTop:20, marginBottom:30, fontSize:16,
              }]}>Da li ste sigurni da želite dodati proizvod bez slike?</Text>
              }
              {!tried && <>
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
                placeholder="Opis proizvoda(do 250 karaktera)"
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

              
              {
              (path==='' || path===null || path===undefined) && 
              <TouchableOpacity style={[styles.imagePickerButton, {width:'70%', marginBottom:20}]} onPress={pickImage}>
                <Text style={styles.imagePickerButtonText}>Izaberi sliku proizvoda</Text>
              </TouchableOpacity>
              }

            {path!=='' && path!==null && path!==undefined && <Image source={{ uri: path }} style={styles.previewImage} />}

            {
              (path!=='' && path!==null && path!==undefined) && 
              <View style={[{justifyContent:'center', alignItems:'center', width:'70%',marginBottom:20}]}>
              <TouchableOpacity style={[styles.imagePickerButton, 
                {marginBottom:5, }]} onPress={pickImage}>
                <Text style={styles.imagePickerButtonText}>Promeni sliku proizvoda</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.imagePickerButton, {marginTop:5,
                backgroundColor:'red'
              }]} onPress={()=>setPath("")}>
                <Text style={styles.imagePickerButtonText}>Obriši sliku proizvoda</Text>
              </TouchableOpacity>
              </View>
              }
              </>
              }
              
              <View style={styles.modalActions}>
                
              <TouchableOpacity onPress={closeModal}>
                  <Text style={[styles.cancelButtonText, { color: dark ? 'white' : '#124460' }]}>
                    {tried ? "Izmeni proizvod":"Otkaži"}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={addProduct}>
                  <Text style={[styles.deleteButtonText2, { color: dark ? '#6ac17f' : '#6ac17f' }]}>Dodaj</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
    </SafeAreaView>
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
    width: '70%',
    alignSelf: 'center',
    position: 'relative',
    marginBottom:10,
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
    paddingVertical: 5,
    borderRadius: '100%',
    paddingHorizontal:5,
    marginLeft:10,
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
    paddingVertical: 5,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
    backgroundColor:'#6ac17f', 
    paddingHorizontal:15,
    
  },
  imagePickerButtonText: {
    color: 'white',
    fontWeight:'500'
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
  },loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  }, actions:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
  }
});

export default ProductsPage;
