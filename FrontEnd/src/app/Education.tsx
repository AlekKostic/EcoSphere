import { 
  View, Text, Linking, TouchableOpacity, StyleSheet, 
  TextInput, Keyboard, TouchableWithoutFeedback 
} from 'react-native';
import React, { useState, useRef, useMemo, useEffect } from 'react';
import BackNav from '../components/Backnav';
import { MaterialIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Icon2 = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef(null);
  const [dark, setDark] = useState(false);

  const getMode = async () => {
    const storedMode = await AsyncStorage.getItem('darkMode');
    if (storedMode === "true") setDark(true);
  };

  useEffect(() => {
    getMode();
  }, []);

  const videoLinks = [
    { title: 'Radionica "Reciklaža nije gnjavaža" za decu', link: 'https://www.tiktok.com/@mojsvetns/video/7435042170282806584' },
    { title: 'Common Waste - Common Libraries - Goethe-Institut Srbija', link: 'https://www.goethe.de/ins/cs/sr/kul/sup/cnw.html' },
    { title: 'Uvođenje sistema reciklaže i ekološko obrazovanje', link: 'https://openjicareport.jica.go.jp/pdf/1000052997_02.pdf' },
    { title: 'Eko aktivnosti - Oaza znanja', link: 'https://nvooazaznanja.wordpress.com/wp-content/uploads/2019/05/eko-aktivnosti.pdf' },
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
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const filteredLinks = videoLinks.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, dark ? styles.containerDark : styles.containerLight]}>
        <BackNav />
        <Text style={[styles.heading, dark ? styles.headingDark : styles.headingLight]}>Edukacija o Reciklaži i Zaštiti Životne Sredine</Text>
        <Text style={[styles.subheading, dark ? styles.subheadingDark : styles.subheadingLight]}>
          Ovde možete pronaći edukativne materijale u vidu sajtova i snimaka koji podižu svest o važnosti brige o životnoj sredini.
        </Text>

        <View style={styles.searchContainer}>
          <TextInput
            ref={inputRef}
            style={[styles.searchInput, dark ? styles.searchInputDark : styles.searchInputLight]}
            placeholder="Pretraži..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={dark ? '#124460' : '#124460'}
          />
          <TouchableOpacity onPress={toggleKeyboard} style={styles.iconWrapper}>
            <MaterialIcons name="search" size={24} color={dark ? '#124460' : '#124460'} />
          </TouchableOpacity>
        </View>

        <KeyboardAwareScrollView
          style={[styles.postsContainer, dark ? styles.postsContainerDark : styles.postsContainerLight]}
          persistentScrollbar={true}
          keyboardShouldPersistTaps="handled"
        >
          {filteredLinks.length === 0 ? (
            <Text style={[styles.noResults, dark ? styles.noResultsDark : styles.noResultsLight]}>Nema rezultata</Text>
          ) : (
            filteredLinks.map((video, index) => (
              <TouchableOpacity key={index} onPress={() => handlePress(video.link)} style={styles.videoLink}>
                <View style={[styles.card, dark ? styles.cardDark : styles.cardLight]}>
                  <MaterialIcons name={assignedIcons[index]} size={24} color={dark ? '#E8F5E9' : '#124460'} style={styles.icon} />
                  <Text style={[styles.videoTitle, dark ? styles.videoTitleDark : styles.videoTitleLight]}>{video.title}</Text>
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
  },
  containerLight: {
    backgroundColor: 'white',
  },
  containerDark: {
    backgroundColor: '#124460',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 20,
    textAlign: 'center',
  },
  headingLight: {
    color: '#124460',
  },
  headingDark: {
    color: '#E8F5E9',
  },
  subheading: {
    fontSize: 20,
    paddingBottom: 30,
    marginBottom: 30,
    textAlign: 'center',
    
  },
  subheadingLight: {
    color: '#124460',
    borderBottomColor: '#124460',
    borderBottomWidth: 2,
  },
  subheadingDark: {
    color: '#E8F5E9',
    borderBottomColor: 'white',
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
  searchInputLight: {
    backgroundColor: '#fff',
    borderColor:'#124460',
    borderWidth: 1,
    color: '#333',
  },
  searchInputDark: {
    backgroundColor: 'white',
    color: '#124460',
  },
  iconWrapper: {
    position: 'absolute',
    right: 10,
    padding: 5,
  },
  postsContainer: {
    borderRadius:5,
    paddingTop:5,
    paddingHorizontal: 10,
  },
  postsContainerLight: {
    backgroundColor: '#fff',
  },
  postsContainerDark: {
    backgroundColor: '#1b5975',
  },
  videoLink: {
    marginBottom: 10,
  },
  card: {
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 5,
  },
  cardLight: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
  },
  cardDark: {
    backgroundColor: '#2f6d8c',
    borderColor: '#34495e',
  },
  icon: {
    marginRight: 15,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  videoTitleLight: {
    color: '#333',
  },
  videoTitleDark: {
    color: '#E8F5E9',
  },
  noResults: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  noResultsLight: {
    color: '#888',
  },
  noResultsDark: {
    color: '#E8F5E9',
  },
});

export default Icon2;
