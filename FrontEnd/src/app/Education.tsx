import { 
  View, Text, Linking, TouchableOpacity, StyleSheet, 
  TextInput, Keyboard, TouchableWithoutFeedback, 
  Modal,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import React, { useState, useRef, useMemo, useEffect } from 'react';
import BackNav from '../components/Backnav';
import { MaterialIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WebView from 'react-native-webview';
const { height } = Dimensions.get('window'); // Dobijamo visinu ekrana

const Icon2 = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef(null);
  const [dark, setDark] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [modalVisible,setModalVisible]=useState(false)
  const [loading,setLoading]=useState(false)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const getMode = async () => {
    const storedMode = await AsyncStorage.getItem('darkMode');
    if (storedMode === "true") setDark(true);
  };

  useEffect(() => {
    getMode();
  }, []);

  const videoLinks = [
    { title: 'Savetodavni portal za reciklažu - Recycle Now', link: 'https://www.recyclenow.com' },
    { title: 'Američko udruženje za šume i papirnu industriju', link: 'https://www.afandpa.org' },
    { title: 'Plastika i reciklaža - Plastics Europe', link: 'https://plasticseurope.org' },
    { title: 'Reciklaža plastike u praksi', link: 'https://www.reciklaza-plastike.com' },
    { title: 'Reciklaža plastike - Srpski resursi', link: 'http://reciklazaplastike.rs' },
    { title: 'Eko Flor - Ekološki proizvodi i reciklaža', link: 'http://www.ekoflor-nordtrade.co.rs' },
    { title: 'Inicijativa "Ja bolji građanin" - Ekološki saveti', link: 'https://jaboljigradjanin.com' },
    { title: 'Reciklaža metala - Metal Kat', link: 'https://metalkatrecycle.com' },
    { title: 'Besplatno recikliranje - Freecycle', link: 'https://www.freecycle.org' },
    { title: 'Pretraživanje resursa za reciklažu - Zemlja 911', link: 'https://search.earth911.com' },
    { title: 'Top 50 sajtova za reciklažu - Zelena šibica', link: 'https://www.greenmatch.co.uk/blog/2015/07/top-50-recycling-sites' },
    { title: 'TerraCycle - Inovativna reciklaža', link: 'https://www.terracycle.com/en-US/?srsltid=AfmBOoq7b01drY3XYYOUdl_rxQfvMUADYD2N4PB3KmXsk4Q0DHf-o804' },
    { title: 'Upravljanje otpadom - Lokacije za odlaganje', link: 'https://www.wm.com/us/en/drop-off-locations' },
    { title: 'Reciklaža kartona - Love Junk', link: 'https://www.lovejunk.com/cardboard-recycling' },
    { title: 'Gde možete reciklirati? - Recycle More', link: 'https://www.recycle-more.co.uk/where-can-i-recycle' },
    { title: 'Recikliranje u vašem kraju - Recycling Near You', link: 'https://recyclingnearyou.com.au/paper-cardboard/' },
    { title: 'Globalno zagrevanje i reciklaža - Climate Reality', link: 'https://www.climaterealityproject.org' },
    { title: 'Reciklaža u gradovima - Sustainable Cities', link: 'https://www.sustainablecities.eu' },
    { title: 'Važnost reciklaže za budućnost', link: 'https://www.recycleacrossamerica.org/why-recycling-matters' },
    { title: 'Učinite planetu zdravijom - WWF', link: 'https://www.worldwildlife.org' },
    { title: 'Ekološki otisak i reciklaža - Global Footprint Network', link: 'https://www.footprintnetwork.org' },
    { title: 'Zeleni gradovi i održivost - Eco-Cities', link: 'https://www.ecocitybuilders.org' },
    { title: 'Savetnik za zelenu energiju i reciklažu - Green Energy Solutions', link: 'https://www.greenenergysolutions.org' },
    { title: 'Uloga reciklaže u smanjenju otpada - Zero Waste Europe', link: 'https://www.zerowasteeurope.eu' },
    { title: 'Kako smanjiti otpad i povećati reciklažu - Waste Management', link: 'https://www.wm.com' }
  ];
  
  

  const icons = ['recycling', 'public', 'favorite', 'eco', 'lightbulb', 'language', 'search'];

  const assignedIcons = useMemo(() => {
    return videoLinks.map(() => {
      const randomIndex = Math.floor(Math.random() * icons.length);
      return icons[randomIndex];
    });
  }, []);

  const handlePress = (url) => {

    
    setCurrentUrl(url);
    console.log(url)
    setLoading(true);
    setModalVisible(true);
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
    <>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <>
      <BackNav />
      <View style={[styles.container, dark ? styles.containerDark : styles.containerLight]}>

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
            onFocus={() => setIsKeyboardVisible(true)}
            onBlur={() => setIsKeyboardVisible(false)}
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


      
      </>
    </TouchableWithoutFeedback>

    <Modal visible={modalVisible} animationType="slide" transparent={true} >
      <View style={[{flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.7)'}]}>

        <View style={[{width: '100%',
          height: height * 0.8,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20, 
          backgroundColor: dark ? '#124460' : 'white' }]}>

          <View style={[{marginTop:20,
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            marginRight:20, marginBottom:20}]}>
            <TouchableOpacity onPress={()=>{setModalVisible(false);setCurrentUrl("")}}>
                <MaterialIcons name="close" size={30} color={dark ? 'white' : '#124460'} />
            </TouchableOpacity>
          </View>

          {loading && (
            <View style={[{position: 'absolute', top: '50%', left: '50%', 
            transform: [{ translateX: -50 }, 
            { translateY: -50 }], 
            alignItems: 'center'}]}>
              <ActivityIndicator size="large" color={dark?'white':'#124460'} />
              <Text style={[{color: dark?'white':'#124460', fontSize: 18, marginTop: 10}]}>Učitavanje...</Text>
            </View>
          )}
            <WebView 
            source={{ uri: currentUrl }} 
            style={{ flex: 1, opacity: loading?0:1 }} 
            onLoad={() => setLoading(false)}
            onLoadStart={() => setLoading(true)}
          />
        </View>
      </View>
    </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
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
