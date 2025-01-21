import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';
import BackNav from '../components/Backnav';

const NotificationsPage = () => {
  const [posts, setPosts] = useState([
    { id: '1', text: 'Dobrodošli na našu stranicu!', profile: 'Admin', liked: false },
  ]);
  const [newPost, setNewPost] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const addPost = () => {
    if (newPost.trim()) {
      setPosts([
        { id: Date.now().toString(), text: newPost, profile: 'User', liked: false },
        ...posts,
      ]);
      setNewPost('');
      setIsModalVisible(false);
    }
  };

  const toggleLikePost = (id) => {
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, liked: !post.liked } : post
      )
    );
  };

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <Text style={styles.profileText}>{item.profile}</Text>
      <Text style={styles.postText}>{item.text}</Text>
      <View style={styles.likeContainer}>
        <TouchableOpacity onPress={() => toggleLikePost(item.id)} style={styles.likeButton}>
          <Text style={[styles.heartIcon, { color: item.liked ? 'red' : 'gray' }]}>❤️</Text>
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
    marginBottom: 5,
  },
  postText: {
    fontSize: 16,
    marginBottom: 10,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeButton: {
    marginRight: 10,
  },
  heartIcon: {
    fontSize: 20,
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
