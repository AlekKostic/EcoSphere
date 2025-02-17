import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert, FlatList, ActivityIndicator, Modal, StatusBar, Platform, AppState, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackNav from '../components/Backnav';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRouter } from 'expo-router';
import axios from 'axios';
import Post from '../components/Post';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Product from '../components/Product';

type User = {
  email: string;
  ime: string;
  likesids: number[];
  postsids: number[];
  prezime: string;
  broj_bodova: number;
  radjen: string;
  sacuvaniProductids: number[];  
  streak: number;
  user_id: number;
};


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

interface Post {
  id: number;
  authorId: string;
  content: string | null;
  likes: boolean;
  likedIds: string[];
  author: {
    ime: string;
    prezime: string;
  };
}

type RootStackParamList = {
  UserInfo: {
    id: number | null;
  };
};

interface Item {
  id_likes: number;
  postovis: {
    content: string;
    id: number;
  };
}

type RouteParams = RouteProp<RootStackParamList, 'UserInfo'>;

const UserInfo = () => {

  const route = useRoute<RouteParams>();
  const [dark, setDark] = useState(false);

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
  const iduser = route.params?.id ?? 0;

  const [user, setUser] = useState<User>({
    email: '',
    ime: '',
    likesids: [],
    postsids: [],
    prezime: '',
    broj_bodova: 0,
    radjen: '',
    sacuvaniProductids: [],
    streak: 0,
    user_id: 0
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [logged, setLogged] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [personal, setPersonal] = useState(false);
  const [changing, setChanging] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  const [loadingPosts, setLoadingPosts] = useState(true);
  const [deleteModalVisiblePost, setDeleteModalVisiblePost] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteaModalVisible, setDeleteaModalVisible] = useState(false);
  const [seeSaved, setSeeSaved] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);

  const [selectedTab, setSelectedTab] = useState('objave'); 
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [saves, setSaved] = useState(0);

  const [logId, setLogId]=useState(0)

  const router = useRouter();
  const config = require('../../config.json');
  const ip = config.ipAddress;
  
  const [savedProducts, setSavedProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [errorEdit, setErrorEdit]=useState("")

  const imageId = iduser % 6 + 1;
  let profileImageSource = require('../img/profilna6.png');

  if (imageId === 1) profileImageSource = require('../img/profilna1.png');
  else if (imageId === 2) profileImageSource = require('../img/profilna2.png');
  else if (imageId === 3) profileImageSource = require('../img/profilna3.png');
  else if (imageId === 4) profileImageSource = require('../img/profilna4.png');
  else if (imageId === 5) profileImageSource = require('../img/profilna5.png');

  const fetchUserInfo = async () => {
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (userInfo) {
        const parsedUserInfo = JSON.parse(userInfo);
        const userId = parsedUserInfo.userId;
        if (userId.toString() === iduser.toString()) {
          setPersonal(true);
        }

        setLogId(userId)
        
        setLogged(true);
      }
    } catch (err) {
    }
  };

  const handleDeleteProduct = async () => {
    if(!productToDelete)return
    try {
      await deleteProd(productToDelete)
      setDeleteModalVisible(false);
      setProducts(prevProducts => {
        const filteredProducts = prevProducts.filter((product:Product) => product.product_id !== productToDelete);
        return filteredProducts;
      });

    } catch (err) {
    }
  };

  
  const deleteProd = async(id:number)=>{

    await axios.delete(`http://${ip}:8080/v5/api/delete/${id}`);
    
  }

  const fetchProduct = async()=>{
    try{
    const response = await axios.get(`http://${ip}:8080/v5/api/user/${iduser}`);
    let productsData = response.data.reverse();
    if(logged)
    {

        const savedResponse = await axios.get(`http://${ip}:8080/v1/api/${logId}`);

        const savedProducts = savedResponse.data.sacuvaniProductids;
        productsData = productsData
          .map((product:Product) => ({
            ...product,
            saved: savedProducts.includes(product.product_id),
          }))
          .sort((a:Product, b:Product) => 
            savedProducts.indexOf(a.product_id) - savedProducts.indexOf(b.product_id));
    }else{
      productsData = productsData.map((product:Product) => ({
        ...product,
        saved: false,
      }));
    }
    setProducts(productsData)
  }catch(error){

  }
  }

  useEffect(() => {
    {
      fetchUserInfo();
    }
  }, []);

  useEffect(() => {
    if (logged) {
      fetchProduct();
    }
  }, [logged]); 

  const fetchPostsData = async () => {
    try {
      const userres = await axios.get(`http://${ip}:8080/v1/api/${iduser}`);
      setUser(userres.data);
      
      const response = await axios.get(`http://${ip}:8080/v4/api`);
      const fetchedPosts = response.data;

      let dictionary: { [key: number]: boolean } = {};

      if (logged) {
        const userInfo2 = await AsyncStorage.getItem('userInfo');
        if(!userInfo2)return
        const parsedUserInfo2 = JSON.parse(userInfo2);
        const userId2 = parsedUserInfo2.userId;

        const response2 = await axios.get(`http://${ip}:8080/v4/api/user/${userId2}`);
        response2.data.forEach((item:Item) => {
          dictionary[item.postovis.id] = true;
        });
      }

      const postsWithAuthors = await Promise.all(
        userres.data.postsids.map(async (postId:number) => {
          const postResponse = await axios.get(`http://${ip}:8080/v4/api/${postId}`);
          const postData = postResponse.data;
          const authorResponse = await axios.get(`http://${ip}:8080/v1/api/${postData.authorId}`);
          const authorData = authorResponse.data;
          return {
            ...postData,
            author: authorData,
            likes: logged ? dictionary[postId] || false : false,
          };
        })
      );

      setPosts([...postsWithAuthors].reverse());
      setLoadingPosts(false);

    } catch (err) {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchPostsData();
  }, [logged]);

  const handleChangePassword = async () => {
    if (!changing) {
      setChanging(true);
      return;
    }
    if (!newPassword) {
      setErrorMessage('Unesite novu lozinku.');
      return;
    }
    const odg = await AsyncStorage.getItem('userInfo');
    if(!odg)return
    const parsedUserInfo = JSON.parse(odg);
    const userPas = parsedUserInfo.password;

    if (currentPassword !== userPas) {
      setErrorMessage('Trenutna lozinka nije ispravna.');
      return;
    }

    await axios.post(`http://${ip}:8080/v1/api/reset`,{
      "id_user": iduser,
      "password": currentPassword
    });

    const updatedUser = { ...user, password: newPassword };

    try {
      await AsyncStorage.setItem('userInfo', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setCurrentPassword('');
      setNewPassword('');
      setErrorMessage('');
      setChanging(false);
    } catch (err) {
      setErrorMessage('Greška prilikom promene lozinke.');
    }
  };

  const handleDeletePost = async () => {
    try {
      await axios.delete(`http://${ip}:8080/v4/api/delete/${postToDelete}`);
      setDeleteModalVisiblePost(false);
      fetchPostsData();
    } catch (err) {
    }
  };

  const likePost = async (item: Post) => {
    if (!logged) {
      router.push('/Login');
      return;
    }

    if (!item.likes) {
      item.likes = true;
      const value = await AsyncStorage.getItem('userInfo');
      const userInfo = value ? JSON.parse(value) : null;
      const userId = userInfo?.userId;

      try {
        const response = await axios.post(`http://${ip}:8080/v4/api/like`, {
          "user_id": userId,
          "post_id": item.id
        });
      
      
        fetchPostsData();
      } catch (error) {
      }
    }else{
      item.likes=false;

      const value = await AsyncStorage.getItem('userInfo');
      const userInfo = value ? JSON.parse(value) : null;
      const userId = userInfo?.userId;

      try {
        const response = await axios.put(`http://${ip}:8080/v4/api/unlike`, {
          "user_id": userId,
          "post_id": item.id
        });
      
        fetchPostsData();
      } catch (error) {
      }
    }
  };

  const [loadingDelete, setLoadingDelete]=useState(false);
  const [ee, setee]=useState("");

  const handleDeleteAccount = async () => {
    setLoadingDelete(true)
    try {
      await axios.delete(`http://${ip}:8080/v1/api/delete/${iduser}`);
      
      await AsyncStorage.removeItem('userInfo');
      await AsyncStorage.removeItem('treeVisits');
      setee("")
      setLoadingDelete(false)
      setDeleteaModalVisible(false)
      router.push('/Home');
    } catch (err) {
      setLoadingDelete(false)
      setee('Greška prilikom brisanja naloga.');
    }
  };

  const savePost = async (item:Product) => {
    if (!logged) {
      router.push('/Login');
      return;
    }
  
    const userInfo = await AsyncStorage.getItem('userInfo');
    const userId = userInfo ? JSON.parse(userInfo).userId : null;
  
    const newSaveStatus = !item.saved;
  
    setSavedProducts((prevPosts) => {
      return prevPosts.map((post) => {
        if (post.product_id === item.product_id) {
          return {
            ...post,
            saved: newSaveStatus
          };
        } else {
          return post;
        }
      });
    });

    setProducts((prevPosts) => {
      return prevPosts.map((post) => {
        if (post.product_id === item.product_id) {
          return {
            ...post,
            saved: newSaveStatus
          };
        } else {
          return post;
        }
      });
    });

  
    try {
      if (newSaveStatus) {
        await axios.put(`http://${ip}:8080/v5/api/save`, {
          user_id: userId,
          product_id: item.product_id,
        });

        setUser((prevUser) => {
          const updatedProductIds = [...prevUser.sacuvaniProductids, item.product_id]; 
          return {
            ...prevUser,
            sacuvaniProductids: updatedProductIds 
          };
        });

        setSaved(saves+1)

        
  
      } else {
        await axios.put(`http://${ip}:8080/v5/api/unsave`, {
          user_id: userId,
          product_id: item.product_id,
        });

        setUser((prevUser) => {
          const updatedProductIds = (prevUser.sacuvaniProductids || []).filter(id => id !== item.product_id);

          return {
            ...prevUser,
            sacuvaniProductids: updatedProductIds
          };
        });
        setSaved(saves-1)


      }
    } catch (error) {
      setSavedProducts((prevPosts) =>
        prevPosts.map((post) =>
          post.product_id === item.product_id
            ? { ...post, saved: post.saved ? false : newSaveStatus }
            : post
        )
      );
    }
  
    return;
  };
  

  const seeFolders = async() =>{
    setSeeSaved(true)
    const response = await axios.get(`http://${ip}:8080/v5/api`)

    const data = response.data.filter((product:Product) => user.sacuvaniProductids.includes(product.product_id));
    setSaved(data.length)
    const updatedData = data.map((product:Product) => ({ ...product, saved: true }));
    setSavedProducts(updatedData);


  }

  const [editing, setEditing] = useState<Post | null>(null);
  const [editedContent, setEditedContent] = useState<string | null>(null);
  const [isModalVisibleEdit, setIsModalVisibleEdit] = useState(false);

  const handleEdit = async (item:Post) => {
    setIsModalVisibleEdit(true)
    setEditing(item)
    setEditedContent(item.content)

  };

  const submitEdit = async()=>{
    if(!editing)return
    if(editedContent=="")
      {
        setErrorEdit("Molimo unesite tekst objave.")
        return;
      }
    setErrorEdit("")

    const resp = await axios.put(`http://${ip}:8080/v4/api/edit`, {
      "post_id": editing?.id,
      "new_content": editedContent
  })

    posts.map((post, index) => {
    
      if(post.id === editing?.id) {
        return {
          ...post,
          content: editedContent
        };
      }
    
      return post;
    });
    
    setPosts(prevPosts => 
      prevPosts.map((post) => {
        if(post.id === editing.id) {
          return { ...post, content: editedContent };
        }
        return post; 
      })
    );
    


    setIsModalVisibleEdit(false)

  }

  const handleTree = ()=>{

    router.push({
      pathname: '/Tree',
      params: { poeni: user.broj_bodova, userId: user.user_id},
    });
  }

  return (
    <SafeAreaView style={{flex:1, backgroundColor:dark?'#124460':'white'}}>
    
    <BackNav />
    <KeyboardAwareScrollView style={[styles.container, {
      backgroundColor: dark?'#124460':'white'
    }]} keyboardShouldPersistTaps="handled">
      <View>
      <View style={[styles.profileContainer,{
      backgroundColor: dark?'#1b5975':'#dfeaf0'
    }]}>
        <Image source={profileImageSource} style={styles.profileImage} />
        <View style={styles.userInfo}>
          <Text style={[styles.userName,{color: dark?'white':'#124460'}]}>
            {user.ime + ' ' + user.prezime}
          </Text>
          <Text style={[styles.userDetails, {color: dark?'white':'#124460'}]}>
            {user.email ? 'E-mail: ' + (user.email): ""}
          </Text>
        </View>
        
      </View>
      {personal && 
        <TouchableOpacity onPress={()=>{seeFolders()}} style={[{ 
          position:'absolute',
          bottom:30,
          right:10
        }]}>
        <MaterialIcons
            name={"folder-open"} 
            size={24}
            color={dark ? 'white' : '#124460'}
          />
          </TouchableOpacity>}
      </View>

      {!personal && 
      <View style={[styles.bodovicontainer, , {borderColor: dark?'white':'#124460'}]}>
      <Text style={[styles.bodovi , {color: dark?'white':'#124460'}]}>Broj stabala korisnika: {Math.floor(user.broj_bodova/100)}
        </Text>
      </View>}
      {personal && 

      <View style={[{marginBottom:10, }]}>
        <TouchableOpacity onPress={handleTree} style={[{borderTopWidth:1,
        borderBottomWidth:1,
        marginHorizontal:5,
        borderColor: dark?'white':'#124460',
        flexDirection:'row',
        alignItems: 'center', 
        justifyContent: 'space-between',
        
        }]}>
          <Text style={[{fontSize: 18,
           fontWeight: '500',
           color: dark?'white':'#124460',
           padding:12}]}>Vaše stablo</Text>

          <MaterialIcons
            name={"arrow-forward-ios"} 
            size={20}
            color={dark ? 'white' : '#124460'}
            style={[{paddingRight:10}]}
          />
        </TouchableOpacity>
      </View>
      }

      {personal && (
        <>
          <View style={styles.passwordChangeContainer}>
            {changing && (
              <>
                <View style={[styles.changePasswordHeader, {backgroundColor: dark ? 'white' : '#124460'}]}>
                  <Text style={[styles.changePasswordTitle, {color: dark ? 'white' : '#124460'}]}>Promena lozinke</Text>
                  <TouchableOpacity onPress={() => {setChanging(false); setErrorMessage("")}} style={styles.cancelButton}>
                    <Text style={styles.buttonText}>X</Text>
                  </TouchableOpacity>
                </View>

                <Text style={[styles.label, {color: dark?'white':'#124460'}]}>Trenutna lozinka</Text>
                <TextInput
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  style={styles.input}
                  placeholder="Unesite trenutnu lozinku..."
                  placeholderTextColor="gray"
                  secureTextEntry={true}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                />

                <Text style={[styles.label, {color: dark?'white':'#124460'}]}>Nova lozinka</Text>
                <TextInput
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  style={styles.input}
                  placeholder="Unesite novu lozinku..."
                  placeholderTextColor="gray"
                  secureTextEntry={true}
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
              </>
            )}

            <TouchableOpacity onPress={handleChangePassword} style={[styles.button,{
              backgroundColor: dark? '#6ac17f':'#124460'
            }]}>
              <Text style={styles.buttonText}>Promenite lozinku</Text>
            </TouchableOpacity>

            {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
          </View>

          <TouchableOpacity onPress={()=>setDeleteaModalVisible(true)} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Obrišite nalog</Text>
          </TouchableOpacity>
        </>
      )}

<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
      <TouchableOpacity 
        style={{ flex: 1, alignItems: 'center', borderBottomWidth: selectedTab === 'objave' ? 2 : 0, borderBottomColor: dark ? 'white' : '#124460' }} 
        onPress={() => setSelectedTab('objave')}
      >
        <Text style={[styles.postsHeader, { color: dark ? 'white' : '#124460',
          fontWeight: selectedTab === 'objave' ? '700' : '500' }]}>
          Objave korisnika
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={{ flex: 1, alignItems: 'center', 
          borderBottomWidth: selectedTab === 'proizvodi' ? 2 : 0, 
          borderBottomColor: dark ? 'white' : '#124460'
         }} 
        onPress={() => setSelectedTab('proizvodi')}
      >
        <Text style={[styles.postsHeader, { color: dark ? 'white' : '#124460',
          fontWeight: selectedTab === 'proizvodi' ? '700' : '500'
         }]}>
          Proizvodi korisnika
        </Text>
      </TouchableOpacity>
    </View>


    {selectedTab === 'objave' && (
        loadingPosts ? (
          <ActivityIndicator size="large" color={dark?'white':'#124460'} style={styles.loadingIndicator} />
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <Post key={post.id} item={post} likePost={likePost} personal={personal}
              handleDelete={() => { setPostToDelete(post.id); setDeleteModalVisiblePost(true);
               }} 
              handleEdit={handleEdit}/>
            ))
        ) : (
          <Text style={[styles.noPostsText, { color: dark ? 'white' : '#124460' }]}>
            Nema postova za prikazivanje.
          </Text>
        )
      )}

{selectedTab === 'proizvodi' && (
  loadingPosts ? (
    <ActivityIndicator size="large" color={dark?'white':'#124460'} style={styles.loadingIndicator} />
  ) : products.length > 0 ? (
    products.map((product) => (
      <TouchableOpacity key={product.product_id} onPress={() => {
      }}>
        <Product personal={personal} item={product} dark={dark} savePost={savePost}
        deleteProd={() => { setProductToDelete(product.product_id); setDeleteModalVisible(true); }}
         />
      </TouchableOpacity>
    ))
  ) : (
    <Text style={[styles.noPostsText, { color: dark ? 'white' : '#124460' }]}>
      Nema proizvoda za prikazivanje.
    </Text>
  )
)}

<Modal
  transparent={true}
  visible={deleteModalVisible}
  onRequestClose={() => setDeleteModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={[styles.modalContainer, {backgroundColor: dark?'#1b5975':'white'}]}>
    <View style={[styles.modalHeader]}>
      <Text style={[styles.modalTitle, { color: dark ? 'white' : '#124460' }]}>
        Potvrdi brisanje
      </Text>
    </View>

      <Text style={[styles.modalText, {color: dark?'white':'#124460'}]}>
        Da li ste sigurni da želite da obrišete ovaj proizvod?
      </Text>
      <View style={styles.modalActions}>

        <TouchableOpacity onPress={() => setDeleteModalVisible(false)}>
          <Text style={[styles.cancelButtonText, {color: dark?'white':'#124460'}]}>Otkaži</Text>
        </TouchableOpacity>   
         <TouchableOpacity onPress={handleDeleteProduct}>
          <Text style={[styles.deleteButtonText2, {color: dark?'#ff999c':'#9a2626'}]}>Obriši</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

<Modal
  transparent={true}
  visible={deleteaModalVisible}
  onRequestClose={() => setDeleteaModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={[styles.modalContainer, {backgroundColor: dark?'#1b5975':'white'}]}>
      {loadingDelete && (
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
      <View style={styles.modalHeader}>
          <Text style={[styles.modalTitle, { color: dark ? 'white' : '#124460' }]}>
            Potvrdi brisanje
          </Text>
        </View>

      <Text style={[styles.modalText, {color: dark?'white':'#124460'}]}>
        Da li ste sigurni da želite da obrišete nalog?
      </Text>

      {ee!=="" && <Text style={{color: dark?'#ff999c':'#9a2626', alignSelf:'center'}}>{ee}</Text>}
      <View style={styles.modalActions}>

        <TouchableOpacity onPress={() => {setDeleteaModalVisible(false); setee("");}}>
          <Text style={[styles.cancelButtonText, {color: dark?'white':'#124460'}]}>Otkaži</Text>
        </TouchableOpacity>   
         <TouchableOpacity onPress={handleDeleteAccount}>
          <Text style={[styles.deleteButtonText2, {color: dark?'#ff999c':'#9a2626'}]}>Obriši</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

      <Modal
        transparent={true}
        visible={deleteModalVisiblePost}
        onRequestClose={() => setDeleteModalVisiblePost(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, {backgroundColor: dark?'#1b5975':'white'}]}>
            <View style={[styles.modalHeader]}>
              <Text style={[styles.modalTitle,{color: dark?'white':'#124460'}]}>Potvrdi brisanje</Text>
            </View>
            <Text style={[styles.modalText, {color: dark?'white':'#124460'}]}>Da li ste sigurni da želite da obrišete ovaj post?</Text>
            <View style={styles.modalActions}>
              
              <TouchableOpacity
                onPress={() => setDeleteModalVisiblePost(false)}
              >
                <Text style={[styles.cancelButtonText, {color: dark?'white':'#124460'}]}>Otkaži</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDeletePost}
              >
                <Text style={[styles.deleteButtonText2, , {color: dark?'#ff999c':'#9a2626'}]}>Obriši</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent={true}
        visible={seeSaved}
        onRequestClose={() => setSeeSaved(false)}>
        <View style={styles.modalOverlay2}>
            
          <View style={[styles.modalContainer2, { backgroundColor: dark ? '#2c3e50' : '#fff' }]}>
          <View style={styles.modalHeader2}>
            <TouchableOpacity onPress={() => setSeeSaved(false)} style={styles.closeButton2}>
              <MaterialCommunityIcons name="close" size={24} color={dark ? 'white' : '#333'} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle2, { color: dark ? '#fff' : '#124460' }]}>
              Ukupno sačuvanih proizvoda: {saves}
            </Text>
          </View>
          {saves === 0 ? (
            <Text style={[styles.noSavesText, { color: dark ? '#ccc' : '#aaa' }]}>Nema sačuvanih proizvoda</Text>
          ) : (
            
            <FlatList
            data={savedProducts}
            keyExtractor={(item) => item.product_id.toString()}
            renderItem={({ item }) => (
              <Product item={item} dark={dark} savePost={savePost} />
            )}
            contentContainerStyle={{ paddingBottom: 20, marginTop:15, marginHorizontal:5 }}
          />

          )}

          </View>
        </View>
        </Modal>
        <Modal
                visible={isModalVisibleEdit}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsModalVisibleEdit(false)}
              >
          <View style={styles.modalOverlay}>
                <View style={[styles.modalContainer, {backgroundColor: dark?'#124460':'white'}]}>
                  
                    <Text style={[styles.modalTitle, { color: dark ? 'white' : '#124460'
                    , marginBottom: 20
                     }]}>Izmena objave</Text>
                    <TextInput
                    style={[styles.input, { 
                      backgroundColor: dark ? 'white' : '#fff',
                      color: dark ? '#124460' : '#124460',
                      borderColor: '#124460',
                      marginBottom: 10 
                    }]}
                    placeholder="Unesite izmenjenu objavu"
                    placeholderTextColor={dark ? '#124460' : '#124460'}
                    value={editedContent || ''}
                    onChangeText={setEditedContent}
                  />

                    {errorEdit && (
              <Text 
                style={[
                  { color: 'red' },
                  { alignSelf: 'center' },
                  {marginBottom: 10}  
                ]}
              >
                {errorEdit}
              </Text>
            )}
                    <View style={styles.modalActions}>
                      
                    <TouchableOpacity onPress={() => {setErrorEdit(""), setIsModalVisibleEdit(false)}}>
                      <Text style={[styles.cancelButtonText, {color: dark?'white':'#124460'}]}>Otkaži</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>submitEdit()}>
                      <Text style={[styles.deleteButtonText2, , {color: dark?'#6ac17f':'#6ac17f'}]}>Izmeni</Text>
                    </TouchableOpacity>
                    </View>
                </View>
           </View>
        </Modal>
        

    </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  postsHeader: {
    fontSize: 15,
    fontWeight: '500',
    marginTop: 20,
    marginBottom: 20,
    color: '#333',
  },
  loadingIndicator: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileContainer: {
    backgroundColor: '#dedddc',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 25,
    padding: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginRight: 20,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#333',
  },
  userDetails: {
    marginTop: 5,
    fontSize: 15,
    color: '#666',
  },
  passwordChangeContainer: {
    paddingHorizontal: 20,
  },
  changePasswordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  changePasswordTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 30,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: '#C9D3DB',
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 12,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#075eec',
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  errorMessage: {
    color: '#9a2626',
    fontSize: 16,
    marginTop: 10,
  },
  deleteButton: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    backgroundColor: '#9a2626',
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  bodovicontainer: {
    marginLeft: 20,
    marginBottom: 15,
    borderBottomWidth: 2,
    paddingBottom: 15,
  },
  bodovi: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  noPostsText: {
    fontSize: 16,
    color: '#888',
    marginTop: 20,
    marginLeft: 20,
  },modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  modalText: {
    fontSize: 16,
    marginVertical: 30,
  },
  modalActions: {
    marginTop:20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },deleteButtonText2: {

    fontSize: 18,
    fontWeight: '600',
  },modalOverlay2: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer2: {
    padding: 30,
    borderRadius: 10,
    width: '100%',
    height: '70%',
  }, 
  modalHeader2: {
    alignItems: "flex-start",
    paddingVertical: 10,
  },
  
  closeButton2: {
    alignSelf: "flex-end",
    marginBottom: 15, 
  },
  
  modalTitle2: {
    fontSize: 18,
    fontWeight: "bold",
  },noSavesText: {
    fontSize: 16,
    textAlign: 'center',
  }
  
});

export default UserInfo;