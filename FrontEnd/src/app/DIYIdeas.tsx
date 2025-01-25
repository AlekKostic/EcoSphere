import { 
  View, Text, Linking, TouchableOpacity, StyleSheet, ScrollView, 
  TextInput, Image, Keyboard, TouchableWithoutFeedback, 
  Platform 
} from 'react-native';
import React, { useState, useRef, useMemo } from 'react';
import BackNav from '../components/Backnav';
import { MaterialIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Icon2 = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const inputRef = useRef(null);

  const videoLinks = [
    { title: 'Kako od plastičnih poklopaca napraviti tanjir', 
      link: 'https://youtu.be/FORrE5dB2gc?si=z16cXnDXd2smTJMb', 
      thumbnail: 'https://img.youtube.com/vi/FORrE5dB2gc/0.jpg' },
    { title: 'Kako jedan Dubrovčanin čisti more od plastike i reciklira je', 
      link: 'https://youtu.be/FTftktsN4yA?si=i7CQko9Fh7NzEY_8', 
      thumbnail: 'https://img.youtube.com/vi/FTftktsN4yA/0.jpg' },
    { title: 'Ideje za ponovnu upotrbu predmeta od metala', 
      link: 'https://youtu.be/pLrTWRlxDXw?si=jAbRuLSw1VALjTsP', 
      thumbnail: 'https://img.youtube.com/vi/pLrTWRlxDXw/0.jpg' },

  ];

  const icons = ['recycling', 'public', 'favorite', 'eco', 'lightbulb', 'language', 'search'];

  const assignedIcons = useMemo(() => {
    return videoLinks.map(() => {
      const randomIndex = Math.floor(Math.random() * icons.length);
      return icons[randomIndex];
    });
  }, []);

  const handlePress = (url) => {
    Linking.openURL(url);
  };

  const toggleKeyboard = () => {
    if (isKeyboardVisible) {
      Keyboard.dismiss();
    } else {
      inputRef.current?.focus();
    }
  };

  const filteredLinks = videoLinks.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <BackNav />
        <Text style={styles.heading}>Ideje za ponovnu upotrebu materijala</Text>
        <Text style={styles.subheading}>
          Ovde možete pronaći kreativne ideje za ponovnu upotrebu materijala u svakodnevnom životu.
        </Text>

        {/* Search bar */}
        <View style={styles.searchContainer}>
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Pretraži..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#888"
            onFocus={() => setIsKeyboardVisible(true)}
            onBlur={() => setIsKeyboardVisible(false)}
          />
          <TouchableOpacity onPress={toggleKeyboard} style={styles.iconWrapper}>
            <MaterialIcons name="search" size={24} color="#888" />
          </TouchableOpacity>
        </View>

        {/* Scrollable Content */}
        <KeyboardAwareScrollView style={styles.postsContainer}>
          {/* If no results found */}
          {filteredLinks.length === 0 ? (
            <Text style={styles.noResults}>Nema rezultata</Text>
          ) : (
            filteredLinks.map((video, index) => (
              <TouchableOpacity key={index} onPress={() => handlePress(video.link)} style={styles.videoLink}>
                <View style={styles.card}>
                  <Image
                    source={{ uri: video.thumbnail }}
                    style={styles.thumbnail}
                  />
                  <View style={styles.textContainer}>
                    <Text style={styles.videoTitle}>{video.title}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </KeyboardAwareScrollView>
      </View>
    </TouchableWithoutFeedback>
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
  subheading: {
    fontSize: 20,
    color: '#333',
    paddingBottom: 30,
    marginBottom: 30,
    textAlign: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6e5e3',
    borderRadius: 10,
    marginBottom: 20,
    width: '70%',
    alignSelf: 'center',
    position: 'relative',
  },
  searchInput: {
    flex: 1,
    height: 45,
    borderRadius: 10,
    paddingLeft: 15,
    fontSize: 16,
    paddingRight: 40,
  },
  iconWrapper: {
    position: 'absolute',
    right: 10,
    padding: 5,
  },
  postsContainer: {
    height: 300,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
  },
  videoLink: {
    marginBottom: 15,
  },
  card: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12, 
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row', 
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    width: '100%',
    maxWidth: 350, 
  },
  thumbnail: {
    width: 110,
    height: 100,
    borderRadius: 8,
    marginRight: 15,
  },
  textContainer: {
    flexShrink: 1, 
    width: '70%',
  },
  videoTitle: {
    fontSize: 16, 
    color: '#333',
    fontWeight: 'bold',
    flexWrap: 'wrap', 
    lineHeight: 22, 
    textAlign: 'left', 
  },
  noResults: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Icon2;
