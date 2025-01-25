import { 
  View, Text, Linking, TouchableOpacity, StyleSheet, 
  TextInput, Keyboard, TouchableWithoutFeedback 
} from 'react-native';
import React, { useState, useRef, useMemo } from 'react';
import BackNav from '../components/Backnav';
import { MaterialIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Icon2 = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef(null);

  const videoLinks = [
    { title: 'Radionica "Reciklaža nije gnjavaža" za decu', link: 'https://www.tiktok.com/@mojsvetns/video/7435042170282806584' },
    { title: 'Common Waste - Common Libraries - Goethe-Institut Srbija', link: 'https://www.goethe.de/ins/cs/sr/kul/sup/cnw.html' },
    { title: 'Uvođenje sistema reciklaže i ekološko obrazovanje', link: 'https://openjicareport.jica.go.jp/pdf/1000052997_02.pdf' },
    { title: 'Eko aktivnosti - Oaza znanja', link: 'https://nvooazaznanja.wordpress.com/wp-content/uploads/2019/05/eko-aktivnosti.pdf' },
  ];

  const icons = ['recycling', 'public', 'favorite', 'eco', 'lightbulb', 'language', 'search'];

  // Generišemo nasumične ikone SAMO jednom i čuvamo ih u memoriji
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
      <View style={styles.container}>
        <BackNav />
        <Text style={styles.heading}>Edukacija o Reciklaži i Zaštiti Životne Sredine</Text>
        <Text style={styles.subheading}>
          Ovde možete pronaći edukativne materijale u vidu sajtova i snimaka koji podižu svest o važnosti brige o životnoj sredini.
        </Text>

        {/* Pretraga sa ikonicom desno */}
        <View style={styles.searchContainer}>
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Pretraži..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#888"
          />
          <TouchableOpacity onPress={toggleKeyboard} style={styles.iconWrapper}>
            <MaterialIcons name="search" size={24} color="#888" />
          </TouchableOpacity>
        </View>

        {/* KeyboardAwareScrollView sa persistent scrollbar */}
        <KeyboardAwareScrollView
          style={styles.postsContainer}
          persistentScrollbar={true}
          keyboardShouldPersistTaps="handled"
        >
          {filteredLinks.length === 0 ? (
            <Text style={styles.noResults}>Nema rezultata</Text>
          ) : (
            filteredLinks.map((video, index) => (
              <TouchableOpacity key={index} onPress={() => handlePress(video.link)} style={styles.videoLink}>
                <View style={styles.card}>
                  <MaterialIcons name={assignedIcons[index]} size={24} color="#333" style={styles.icon} />
                  <Text style={styles.videoTitle}>{video.title}</Text>
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
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  videoLink: {
    marginBottom: 10,
  },
  card: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 5,
  },
  icon: {
    marginRight: 15,
  },
  videoTitle: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    flexShrink: 1,
  },
  noResults: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Icon2;
