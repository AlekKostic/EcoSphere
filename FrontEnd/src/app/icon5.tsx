import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Modal, Button, ScrollView } from 'react-native';
import BackNav from '../components/Backnav';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const NotificationsPage = () => {
  const [posts, setPosts] = useState([
    { id: '1', text: 'Dobrodošli na našu stranicu!', profile: 'Admin', liked: false, likes: 0 },
  ]);
  const [newPost, setNewPost] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [likesModalVisible, setLikesModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const addPost = () => {
    if (newPost.trim()) {
      setPosts([
        { id: Date.now().toString(), text: newPost, profile: 'User', liked: false, likes: 0 },
        ...posts,
      ]);
      setNewPost('');
      setIsModalVisible(false);
    }
  };

  const toggleLikePost = (id) => {
    setPosts(
      posts.map((post) =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const showLikes = (post) => {
    setSelectedPost(post);
    setLikesModalVisible(true);
  };

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <Text style={styles.profileText}>{item.profile}</Text>
      <Text style={styles.postText}>{item.text}</Text>
      <View style={styles.likeContainer}>
        <TouchableOpacity onPress={() => toggleLikePost(item.id)} style={styles.likeButton}>
          <MaterialCommunityIcons
            name={item.liked ? 'heart' : 'heart-outline'}
            size={24}
            color={item.liked ? 'red' : '#aaa'}
          />
        </TouchableOpacity>
        <Text style={styles.likesCount}>{item.likes}</Text>
        <TouchableOpacity onPress={() => showLikes(item)} style={styles.seeLikesContainer}>
          <Text style={styles.seeLikesText}>Pogledaj sviđanja</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <BackNav />
        <Text style={styles.heading}>Oglasna tabla</Text>
        <Text style={styles.subheading}>
          Ovde možete podeliti obaveštenja o dešavanjima vezanim za životnu sredinu za
          koje smatrate da treba da vidi što veći broj ljudi.
        </Text>
      </View>
      <TouchableOpacity
        style={styles.addPostButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.addPostButtonText}>+ Dodaj objavu</Text>
      </TouchableOpacity>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        contentContainerStyle={styles.postsList}
      />

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova objava</Text>
            <TextInput
              style={styles.input}
              placeholder="Unesite tekst objave..."
              value={newPost}
              onChangeText={setNewPost}
            />
            <Button title="Dodaj" onPress={addPost} />
            <Button title="Otkaži" color="red" onPress={() => setIsModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Likes Modal (Bottom Pop-up) */}
      <Modal
        visible={likesModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setLikesModalVisible(false)}
      >
        <View style={styles.likesModalContainer}>
          <View style={styles.likesModalContent}>
            <Text style={styles.modalTitle}>Likes</Text>
            <Text style={styles.likesCountText}>
              Total Likes: {selectedPost?.likes}
            </Text>
            <Button title="Close" onPress={() => setLikesModalVisible(false)} />
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
  postsList: {
    paddingBottom: 20,
  },
  postContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  profileText: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 5,
  },
  postText: {
    fontSize: 16,
    marginBottom: 5,
  },
  likeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  likeButton: {
    marginRight: 10,
  },
  likesCount: {
    fontSize: 16,
    color: '#555',
  },
  seeLikesContainer: {
    marginLeft: 5,
  },
  seeLikesText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#aaa',
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
  likesModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  likesModalContent: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  likesCountText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  addPostButton: {
    width: '40%',
    marginLeft: '30%',
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
});

export default NotificationsPage;
