import { View, Text, Linking, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import React, { useState } from 'react';
import BackNav from '../components/Backnav';

const icon2 = () => {
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  const videoLinks = [
    { title: 'RECIKLAŽA MATERIJALA I ZAŠTITA ŽIVOTNE SREDINE', link: 'https://www.youtube.com/watch?v=xxxxxxxxxxx' },
    { title: '8 načina na koje reciklaža utiče na životnu sredinu', link: 'https://www.sekopak.com/nacini-na-koje-reciklaza-utice-na-zivotnu-sredinu' },
    { title: 'Svetski dan reciklaže: Podizanje svesti o važnosti očuvanja planete', link: 'https://www.dobrestvari.rs/svetski-dan-reciklaze' },
    { title: 'Kako recikliranjem čuvamo životnu sredinu?', link: 'https://www.topnovosti.rs/recikliranje-cuvar-zivotne-sredine' },
    { title: 'Zašto je recikliranje važno', link: 'https://www.ekologija.rs/zasto-je-recikliranje-vazno' },
    { title: 'Reciklaža u industriji: Uticaj na smanjenje emisije CO2', link: 'https://www.example.com/video1' },
    { title: 'Kako smanjiti otpad u svakodnevnom životu', link: 'https://www.example.com/video2' },
    { title: 'Smanjenje potrošnje plastike kroz reciklažu', link: 'https://www.example.com/video3' },
    { title: 'Recikliranje elektronike i zaštita prirode', link: 'https://www.example.com/video4' },
    { title: 'Kako reciklirati papir i smanjiti otpad?', link: 'https://www.example.com/video5' },
    // Add more videos here as needed
  ];

  const handlePress = (url) => {
    Linking.openURL(url);
  };

  const filteredLinks = videoLinks.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <BackNav />
      <Text style={styles.heading}>Edukacija o Reciklaži i Zaštiti Životne Sredine</Text>
      <Text style={styles.subheading}>
        Ovde možete pronaći edukativne materijale u vidu sajtova i snimaka koji podižu svest o važnosti brige o životnoj sredini
      </Text>

      {/* Search Bar */}
      <View style={styles.contai}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pretraži..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#888" // Set the placeholder color
        />
      </View>

      {/* Display filtered videos */}
      {filteredLinks.map((video, index) => (
        <TouchableOpacity key={index} onPress={() => handlePress(video.link)} style={styles.videoLink}>
          <View style={styles.card}>
            <Text style={styles.videoTitle}>{video.title}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 30,
    marginBottom: 20,
    textAlign: 'center',
  },
  contai: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    height: 45,
    width: '70%',
    borderColor: '#ddd',
    backgroundColor: '#e6e5e3',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    marginBottom: 20,
  },
  subheading: {
    fontSize: 20,
    color: '#333',
    paddingBottom: 30,
    marginBottom: 30,
    textAlign: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: 2,
  },
  videoLink: {
    marginBottom: 15,
  },
  card: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  videoTitle: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default icon2;
