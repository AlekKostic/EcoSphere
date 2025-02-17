import React, { useEffect, useState, useRef } from 'react';
import { 
  View, Text, TextInput, FlatList, TouchableOpacity, 
  StyleSheet, Modal, Button, ActivityIndicator, Animated,
  Dimensions,
  ScrollView,
  StatusBar,
  Platform,
  AppState,
  SafeAreaView
} from 'react-native';
import BackNav from '../components/Backnav';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import Post from '../components/Post';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import getWorkingHeight from '../components/ScreenHeight';
const { height } = Dimensions.get('window'); 

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

interface Item {
  id_likes: number;
  postovis: {
    content: string;
    id: number;
  };
}

type Author = {
  broj_bodova: number;
  email: string;
  ime: string;
  likesids: number[];
  postsids: number[];
  prezime: string;
  productids: number[];
  radjen: string | null;
  sacuvaniProductids: number[];
  streak: number;
  user_id: number;
};


const NotificationsPage = () => {

  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [editing, setEditing] = useState<Post | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const flatListRef = useRef<FlatList<Post>>(null);



  const router = useRouter();
  const [total, setTotal]=useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleEdit, setIsModalVisibleEdit] = useState(false);
  const [logged, setLogged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(false); 
  const [loadingg, setLoadingg] = useState(false); 


  const config = require('../../config.json');
  const ip = config.ipAddress;

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

  const closeModal = () =>
  {
    setShowModal(false);
  }

  const getPosts = async () => {
    try {
      setLoading(true);
  
      const value = await AsyncStorage.getItem('userInfo');
      const userInfo = value ? JSON.parse(value) : null;
      const userId = userInfo?.userId;
      const isLogged = !!userId; 
  
      setLogged(isLogged);
  
      const response = await axios.get(`http://${ip}:8080/v4/api`);
      const fetchedPosts: Post[] = response.data;

  
      let dictionary: { [key: number]: boolean } = {};
      if (isLogged) {
        const response2 = await axios.get(`http://${ip}:8080/v4/api/user/${userId}`);
        response2.data.forEach((item: Item) => {
          if(item.postovis)dictionary[item.postovis.id] = true;
        });
      }
      const authorsResponses: Author[] = await Promise.all(
        fetchedPosts.map((post: Post) =>
          axios
            .get(`http://${ip}:8080/v1/api/${post.authorId}`)
            .then(res => res.data)
            .catch(() => ({ ime: "Nepoznato", prezime: "" }))
        )
      );
      
  
      const postsWithAuthors = fetchedPosts.map((post: Post, index:number) => ({
        ...post,
        author: authorsResponses[index] as Author,
        likes: isLogged ? !!dictionary[post.id] : false,
      }));
  
      setPosts(postsWithAuthors.reverse());
      setLikedPosts(postsWithAuthors.filter((post:Post)=>post.likes))


    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect (()=> setTotal(likedPosts.length), [likedPosts.length])
  
  useEffect(() => {
    getPosts();
    getMode();
  }, []);

  const getMode = async () => {
    const storedMode = await AsyncStorage.getItem('darkMode');
    if (storedMode === "true") {
      setDark(true);
    } else {
      setDark(false);
    }
  };

  const likePost = async (item:Post) => {
    if (!logged) {
      router.push('/Login');
      return;
    }
  
    const userInfo = await AsyncStorage.getItem('userInfo');
    const userId = userInfo ? JSON.parse(userInfo).userId : null;
  
    if (!item.likes) item.likes = false;
    if (!item.likedIds) item.likedIds = [];
  
    const newLikeStatus = !item.likes;
  
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === item.id ? {
          ...post,
          likes: newLikeStatus,
          likedIds: newLikeStatus
            ? [...post.likedIds, userId]
            : post.likedIds.filter(id => id !== userId)
        } : post
      )
    );
  
    try {
      if (newLikeStatus) {
        await axios.post(`http://${ip}:8080/v4/api/like`, {
          user_id: userId,
          post_id: item.id,
        });

        if(!showModal){
          setLikedPosts(prevPosts => [item, ...prevPosts]);
          setTotal(total+1)
        }
      } else {
        await axios.put(`http://${ip}:8080/v4/api/unlike`, {
          user_id: userId,
          post_id: item.id,
        });

        if(!showModal){
          setLikedPosts(prevPosts => prevPosts.filter(post => post.id !== item.id));
          setTotal(total-1)
        }
      }

      if (newLikeStatus) {
        setLikedPosts(prevPosts =>
          prevPosts.map(post =>
            post.id === item.id ? { ...post, likes: true, 
              likedIds: [userId, ...post.likedIds]
             } : post
          )
        );
        setTotal(total+1)
      } else {
        setLikedPosts(prevPosts =>
          prevPosts.map(post =>
            post.id === item.id ? { ...post, likes: false,
              likedIds: post.likedIds.filter(a=>a!==userId)
             } : post
          )
        );
        setTotal(total-1)
      }
      
    } catch (error) {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === item.id ? {
            ...post,
            likes: !newLikeStatus,
            likedIds: newLikeStatus
              ? post.likedIds.filter(id => id !== userId)
              : [...post.likedIds, userId]
          } : post
        )
      );
    }
  };

  const [editedContent, setEditedContent] = useState<string | null>(null);


  const handleEdit = async (item:Post) => {
    if(showModal)setShowModal(false)
    setIsModalVisibleEdit(true)
    setEditing(item)
    setEditedContent(item.content)
  };

  
  interface UserInfo {
    userId: number; 
  }
  
  const addPost = async () => {
    if (!newPost) {
      setErrorMessage("Molimo unesite tekst.");
      return;
    }
  
    setLoadingg(true);
    try {
      const userInfo = await new Promise<UserInfo | null>((resolve, reject) => {
        AsyncStorage.getItem('userInfo', (err, result) => {
          if (err) {
            reject("Error loading user info");
          } else {
            resolve(result ? JSON.parse(result) : null);
          }
        });
      });
  
      if (!userInfo?.userId) {
        setErrorMessage("Korisnik nije prijavljen.");
        setLoadingg(false);
        return;
      }
  
      const response = await axios.post(`http://${ip}:8080/v4/api/create`, {
        context: newPost,
        user_id: userInfo.userId
      });
  
      const newPostData = response.data;
  
      const authorResponse = await axios.get(`http://${ip}:8080/v1/api/${userInfo.userId}`);
      const authorData = authorResponse.data;
  
      const newPostWithAuthor = {
        ...newPostData,
        author: authorData
      };
  
      setPosts(prevPosts => [newPostWithAuthor, ...prevPosts]);
  
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
      }, 300);
  
      setNewPost("");
      setErrorMessage("");
      setIsModalVisible(false);
      setLoadingg(false);
  
    } catch (error) {
      setLoadingg(false);
      setErrorMessage("Došlo je do greške.");
    }
  };
  
  const [errorEdit, setErrorEdit]=useState("")
  const submitEdit = async()=>{

    if(!editing)return

    try{
    if(editedContent=="")
    {
      setErrorEdit("Molimo unesite tekst objave.")
      return;
    }

    const resp = await axios.put(`http://${ip}:8080/v4/api/edit`, {
        "post_id": editing?.id,
        "new_content": editedContent
    })


    const updatedPosts = posts.map((post) => {
      if (post.id === editing?.id) {
        return {
          ...post,
          content: editedContent,
        };
      }
      return post;
    });

    const updatedliked = likedPosts.map((post) => {
      if (post.id === editing?.id) {
        return {
          ...post,
          content: editedContent,
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    setLikedPosts(updatedliked)


    setErrorEdit("")
    setIsModalVisibleEdit(false)}
    catch(error){
    }

  }


  return (
    <SafeAreaView style={{flex:1, backgroundColor:dark?'#124460':'white'}}>
    <BackNav />
    <View style={[styles.container, { backgroundColor: dark ? '#124460' : 'white' }]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.heading, { color: dark ? 'white' : '#124460' }]}>Oglasna tabla</Text>
        <Text style={[styles.subheading, { color: dark ? 'white' : '#124660', borderBottomColor: dark ? '#fff' : '#124460' }]}>
          Ovde možete pročitati i podeliti obaveštenja o dešavanjima vezanim za životnu
          sredinu koji mogu biti korisni i koje treba da vidi što veći broj ljudi.

        </Text>
      </View>
      <View style={styles.actions}>
      <TouchableOpacity
          style={[styles.addPostButton, { backgroundColor: dark ? '#6ac17f' : '#6ac17f' }]}
          onPress={() =>{ if(!logged)router.push('/Login')
            else setIsModalVisible(true)}}>
              <MaterialCommunityIcons name="plus" size={24} color={dark ? 'white' : 'white'}
              style={[{marginRight:5}]} />
          <Text style={styles.addPostButtonText}>Dodaj objavu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconButton,{
          borderColor: dark? '#6ac17f':'#124460'
        }]} onPress={()=>{setShowModal(true);}}>
          <MaterialCommunityIcons name="account-heart-outline" size={25} color={dark ? 'white' : '#124460'} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={dark ? 'white':'#124460'} />
          <Text style={[styles.loadingText, {color: dark ? 'white':'#124460'}]}>Učitavanje objava...</Text>
        </View>
      ) : (
        <>
          {posts.length === 0 && <Text style={[styles.noPostsText, { color: dark ? 'white' : '#888' }]}>Budite prvi da objavite!</Text>}
          {posts.length !== 0 &&<FlatList
            ref={flatListRef}
            data={posts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <Post item={item} likePost={likePost} 
            handleEdit={handleEdit} handleDelete={()=>{}}/>}
            contentContainerStyle={[styles.postsList, {backgroundColor: dark ? '#1b5975' : '#fff',}]}
          />}
        </>
      )}

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {setIsModalVisible(false);setErrorMessage("")}}
      >
        <View style={[styles.modalContainer]}>

          <View style={[styles.modalContent, {backgroundColor: dark?'#124460':'white'}]}>
            <Text style={[styles.modalTitle, { color: dark ? 'white' : '#124460'
             }]}>Nova objava</Text>

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
             
            <TextInput
              style={[styles.input, { backgroundColor: dark ? 'white' : '#fff', 
                color: dark ? '#124460' : '#124460',
                borderColor: '#124460' }]}
              placeholder="Unesite tekst objave..."
              placeholderTextColor={dark ? '#124460' : '#124460'}
              value={newPost}
              onChangeText={setNewPost}
            />
            
            {errorMessage ? (
            <Text
              style={[
                {
                  color: dark ? 'red' : 'red',
                  textAlign: 'center', 
                  fontSize: 15,
                  fontWeight: '600'
                },
              ]}
            >
              {errorMessage}
            </Text>
          ) : null}


            <View style={styles.modalActions}>
              
            <TouchableOpacity disabled={loadingg} onPress={() => {setNewPost(""),setIsModalVisible(false),setErrorMessage(""), setLoadingg(false)} }>
              <Text style={[styles.cancelButtonText, {color: dark?'white':'#124460'}]}>Otkaži</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={addPost} disabled={loadingg}>
              <Text style={[styles.deleteButtonText2, , {color: dark?'#6ac17f':'#6ac17f'}]}>Dodaj</Text>
            </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isModalVisibleEdit}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisibleEdit(false)}
      >
        <View style={[styles.modalContainer]}>
          <View style={[styles.modalContent, {backgroundColor: dark?'#124460':'white'}]}>
            <Text style={[styles.modalTitle, { color: dark ? 'white' : '#124460'
             }]}>Izmena objave</Text>
            <TextInput
              style={[styles.input, { backgroundColor: dark ? 'white' : '#fff', 
                color: dark ? '#124460' : '#124460',
                borderColor: '#124460', fontSize:16, paddingVertical:15, borderRadius:15 }]}
              placeholder="Unesite izmenjenu objavu"
              placeholderTextColor={dark ? '#124460' : '#124460'}
              value={editedContent || ''}
              onChangeText={setEditedContent}
            />
            {errorEdit && (
              <Text 
                style={[
                  { color: 'red' },
                  { alignSelf: 'center' } 
                ]}
              >
                {errorEdit}
              </Text>
            )}
            <View style={styles.modalActions}>
              
            <TouchableOpacity onPress={() => {setErrorEdit(""),setIsModalVisibleEdit(false)}}>
              <Text style={[styles.cancelButtonText, {color: dark?'white':'#124460'}]}>Otkaži</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>submitEdit()}>
              <Text style={[styles.deleteButtonText2, , {color: dark?'#6ac17f':'#6ac17f'}]}>Izmeni</Text>
            </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>

    

    <Modal
        visible={showModal}
        animationType="none"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>

        <View style={[styles.modalContainer2, { backgroundColor: dark ? '#124460' : 'white' }]}>
              
        <View style={styles.closeModalButton}>
                <TouchableOpacity onPress={closeModal}>
                  <MaterialIcons name="close" size={30} color={dark ? 'white' : '#124460'} />
                </TouchableOpacity>
        </View>

        <View style={[{marginLeft:30}]}>
          <Text style={[{color: dark?'white':'#124460',
            fontSize:20, fontWeight:'bold'}]}>
              Vaše omiljene objave
          </Text>

          <Text style={[{color: dark?'white':'#124460',
            fontSize:17, marginTop:15}]}>Ukupno omiljenih objava: {total}
          </Text>
        </View>
        
        <ScrollView contentContainerStyle={{ flexGrow: 1}}>
        <View style={[{marginTop:10, marginHorizontal:20, marginBottom:20}]}>
          {likedPosts.map((item) => (
              <Post
                key={item.id.toString()}
                item={item}
                likePost={likePost}
                handleEdit={handleEdit}
                handleDelete={()=>{}}
              />
            ))}
          </View>
          </ScrollView>
        </View>
      </View>
      </Modal>
    </SafeAreaView>
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
    borderBottomColor:'#124460',
  },
  postsList: {
    paddingBottom: 10,
    borderRadius:5,
  }, 
  actions: {
    flexDirection: 'row',
    justifyContent:'center',
    alignItems:'center',
    marginBottom:20,
  },
  addPostButton: {
    width: '50%', 
    backgroundColor: '#6ac17f',
    borderRadius: 10,
    paddingVertical:12,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'center',
  },iconButton: {
    padding:7,
    borderWidth:2,
    borderRadius:'100%',
    marginLeft:15,
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  addPostButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight:600,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
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
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    marginRight: 'auto',
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
    backgroundColor: '#fff',

  },
  noPostsText: {
    fontSize: 16,
    color: '#888',
    marginTop: 20,
    marginLeft: 20,
  },deleteButtonText2: {

    fontSize: 18,
    fontWeight: '600',
  }, cancelButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },modalActions: {
    marginTop:20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalContainer2: {
    width: '100%',
    height: getWorkingHeight() * 0.7,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  }, closeModalButton:{
    marginTop:20,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginRight:20,
  }
});


export default NotificationsPage;