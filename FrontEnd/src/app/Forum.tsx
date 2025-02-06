import React, { useEffect, useState, useRef } from 'react';
import { 
  View, Text, TextInput, FlatList, TouchableOpacity, 
  StyleSheet, Modal, Button, ActivityIndicator 
} from 'react-native';
import BackNav from '../components/Backnav';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import Post from '../components/Post';

const NotificationsPage = () => {

  const flatListRef = useRef(null);


  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [newPost, setNewPost] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleEdit, setIsModalVisibleEdit] = useState(false);
  const [logged, setLogged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(false); 

  const config = require('../../config.json');
  const ip = config.ipAddress;

  const getPosts = async () => {
    try {
      setLoading(true);
  
      const value = await AsyncStorage.getItem('userInfo');
      const userInfo = value ? JSON.parse(value) : null;
      const userId = userInfo?.userId;
      const isLogged = !!userId; 
  
      setLogged(isLogged);
  
      const response = await axios.get(`http://${ip}:8080/v4/api`);
      const fetchedPosts = response.data;
  
      let dictionary = {};
      if (isLogged) {
        const response2 = await axios.get(`http://${ip}:8080/v4/api/user/${userId}`);
        response2.data.forEach(item => {
          if(item.postovis)dictionary[item.postovis.id] = true;
        });
      }
  
      const authorsResponses = await Promise.all(
        fetchedPosts.map(post =>
          axios.get(`http://${ip}:8080/v1/api/${post.authorId}`)
            .then(res => res.data)
            .catch(() => ({ ime: "Nepoznato", prezime: "" }))
        )
      );
  
      const postsWithAuthors = fetchedPosts.map((post, index) => ({
        ...post,
        author: authorsResponses[index],
        likes: isLogged ? !!dictionary[post.id] : false,
      }));
  
      setPosts(postsWithAuthors.reverse());
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };
  
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

  const likePost = async (item) => {
    if (!logged) {
      router.push('/Login');
      return;
    }
  
    const userInfo = await AsyncStorage.getItem('userInfo');
    const userId = userInfo ? JSON.parse(userInfo).userId : null;
  
    // Ako post nema likes ili likedIds, inicijalizujte ih
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
      } else {
        await axios.put(`http://${ip}:8080/v4/api/unlike`, {
          user_id: userId,
          post_id: item.id,
        });
      }
    } catch (error) {
      console.error(error);
      // Vrati stanje ako je došlo do greške
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

  const [editing, setEditing] = useState(null);
  const [editedContent, setEditedContent] = useState(null);

  const handleEdit = async (item) => {
    setIsModalVisibleEdit(true)
    setEditing(item)
    setEditedContent(item.content)

  };

  
  const addPost = async () => {

    if(!newPost){
      setErrorMessage("Molimo unesite tekst.")
      return
    }
    try {
    // Vratite Promise koji se rešava kada korisnički podaci budu učitani
    const userInfo = await new Promise((resolve, reject) => {
      AsyncStorage.getItem('userInfo', (err, result) => {
        if (err) {
          reject("Error loading user info");
        } else {
          resolve(result ? JSON.parse(result) : null);
        }
      });
    });

    // Ako korisnički podaci nisu pronađeni ili nema userId, obustavite dalji rad
    if (!userInfo || !userInfo.userId) {
      console.log("User ID not found");
      return; // Prestanite sa izvršavanjem funkcije ako userId nije pronađen
    }

    // Poziv za kreiranje posta
    const response = await axios.post(`http://${ip}:8080/v4/api/create`, {
      "context": newPost,
      "user_id": userInfo.userId
    });


    const newPostData = response.data;

    // Učitajte podatke autora nakon što je post napravljen
    const authorResponse = await axios.get(`http://${ip}:8080/v1/api/${userInfo.userId}`);
    const authorData = authorResponse.data;


    const newPostWithAuthor = {
      ...newPostData,
      author: authorData
    };


    // Dodajte novi post u stanje
    setPosts(prevPosts => [newPostWithAuthor, ...prevPosts]);

    setTimeout(() => {
        flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
      }, 300);

    setNewPost("");
    setErrorMessage("")
    setIsModalVisible(false);
    
  } catch (error) {
    console.error("Error in API request:", error);
  }
};
  const [errorEdit, setErrorEdit]=useState("")
  const submitEdit = async()=>{
    console.log(editedContent)
    if(editedContent=="")
    {
      setErrorEdit("Molimo unesite tekst objave.")
      return;
    }

    const resp = await axios.put(`http://${ip}:8080/v4/api/edit`, {
        "post_id": editing.id,
        "new_content": editedContent
    })


    posts.map((post, index) => {
      if(post.id === editing.id) {
        return {
          ...post,
          content: editedContent
        };
      }
    
      return post;
    });
    
    setPosts(prevPosts => {
      const updatedPosts = [newPostWithAuthor, ...prevPosts];
      return updatedPosts;
    });

    
    

    setErrorEdit("")
    setIsModalVisibleEdit(false)

  }


  return (
    <>
    <BackNav />
    <View style={[styles.container, { backgroundColor: dark ? '#124460' : 'white' }]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.heading, { color: dark ? 'white' : '#124460' }]}>Oglasna tabla</Text>
        <Text style={[styles.subheading, { color: dark ? 'white' : '#124660', borderBottomColor: dark ? '#fff' : '#124460' }]}>
          Ovde možete pročitati i podeliti obaveštenja o dešavanjima vezanim za životnu
          sredinu koji mogu biti korisni i koje treba da vidi što veći broj ljudi.

        </Text>
      </View>

        <TouchableOpacity
          style={[styles.addPostButton, { backgroundColor: dark ? '#6ac17f' : '#6ac17f' }]}
          onPress={() =>{ if(!logged)router.push('/Login')
            else setIsModalVisible(true)}}
        >
          <Text style={styles.addPostButtonText}>+ Dodaj objavu</Text>
        </TouchableOpacity>

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
            handleEdit={handleEdit} setEditing={setEditing} editing={editing}/>}
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
              
            <TouchableOpacity onPress={() => {setNewPost(""),setIsModalVisible(false),setErrorMessage("")}}>
              <Text style={[styles.cancelButtonText, {color: dark?'white':'#124460'}]}>Otkaži</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={addPost}>
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
              value={editedContent}
              onChangeText={setEditedContent}
            />
            {errorEdit && (
              <Text 
                style={[
                  { color: 'red' },
                  { alignSelf: 'center' }  // This will center the text horizontally
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
    </>
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
  addPostButton: {
    width: '50%',
    marginLeft: '25%',
    backgroundColor: '#007BFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  addPostButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  }
});


export default NotificationsPage;
