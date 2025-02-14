import { 
  View, Text, Linking, TouchableOpacity, StyleSheet, ScrollView, 
  TextInput, Image, Keyboard, TouchableWithoutFeedback, 
  Platform, 
  ActivityIndicator,
  Modal,
  Dimensions
} from 'react-native';
import React, { useState, useRef, useMemo, useEffect } from 'react';
import BackNav from '../components/Backnav';
import { MaterialIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WebView from 'react-native-webview';

const { height } = Dimensions.get('window'); 

const Icon2 = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [dark, setDark] = useState(false); 
  const inputRef = useRef<TextInput | null>(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const [modalVisible,setModalVisible]=useState(false)
  const [loading,setLoading]=useState(false)

  const videoLinks = [
    { 
      title: 'Kako od plastičnih poklopaca napraviti tanjir', 
      link: 'https://youtu.be/FORrE5dB2gc?si=z16cXnDXd2smTJMb', 
      thumbnail: 'https://img.youtube.com/vi/FORrE5dB2gc/0.jpg' 
    },
    { 
      title: 'Kako jedan Dubrovčanin čisti more od plastike i reciklira je', 
      link: 'https://youtu.be/FTftktsN4yA?si=i7CQko9Fh7NzEY_8', 
      thumbnail: 'https://img.youtube.com/vi/FTftktsN4yA/0.jpg' 
    },
    { 
      title: 'Kako reciklirati papir', 
      link: 'https://youtu.be/pkf4anK0a-A?feature=shared', 
      thumbnail: 'https://img.youtube.com/vi/pkf4anK0a-A/0.jpg' 
    },
    { 
      title: 'Reciklaža papira', 
      link: 'https://youtu.be/gqv7_HCNsRo?si=aGiUQX1is2LlbrwC', 
      thumbnail: 'https://img.youtube.com/vi/gqv7_HCNsRo/0.jpg' 
    },
    { 
      title: 'Ideje za ponovnu upotrbu predmeta od metala', 
      link: 'https://youtu.be/pLrTWRlxDXw?si=jAbRuLSw1VALjTsP', 
      thumbnail: 'https://img.youtube.com/vi/pLrTWRlxDXw/0.jpg' 
    },
    { 
      title: 'Kako napraviti svica od starog metala', 
      link: 'https://youtu.be/R16S-SU5JPg?si=AS4vtPXrjLIQF5Vj', 
      thumbnail: 'https://img.youtube.com/vi/R16S-SU5JPg/0.jpg' 
    },
    { 
      title: 'Kako napraviti lonac od recikliranog aluminijuma', 
      link: 'https://youtu.be/URDQTDhon7c?si=PcvFm6A7fN7cmXG2', 
      thumbnail: 'https://img.youtube.com/vi/URDQTDhon7c/0.jpg' 
    },
    { 
      title: 'Kako napraviti reciklirane grede od plastike', 
      link: 'https://youtu.be/avdOxtKywbk?si=_UeQXptwf81gaTO9', 
      thumbnail: 'https://img.youtube.com/vi/avdOxtKywbk/0.jpg' 
    },
    { 
      title: 'Genijalne reciklaže ideje', 
      link: 'https://youtu.be/4v5WOkVtx4k?si=vYO95j63kSjngs76', 
      thumbnail: 'https://img.youtube.com/vi/4v5WOkVtx4k/0.jpg' 
    },
    { 
      title: 'Kako napraviti haljinu od papira', 
      link: 'https://youtube.com/shorts/MZ6Yc__eezg?si=7kWau4vu7xcsCO1D', 
      thumbnail: 'https://img.youtube.com/vi/MZ6Yc__eezg/0.jpg' 
    },
    { 
      title: 'Kako napraviti sto od reciklirane plastike', 
      link: 'https://youtu.be/WJnVAQqkdcQ?si=EBzcbYmYWjH0H8ln', 
      thumbnail: 'https://img.youtube.com/vi/WJnVAQqkdcQ/0.jpg' 
    },
    { 
      title: 'Kako napraviti fontanu od plastičnih flaša', 
      link: 'https://youtube.com/shorts/gLZs3dmO91M?si=5wQBFw2b4e8I_-t1', 
      thumbnail: 'https://img.youtube.com/vi/gLZs3dmO91M/0.jpg' 
    },
    { 
      title: 'Kako napraviti peskasti sat od plastičnih flaša', 
      link: 'https://youtube.com/shorts/O7JkFJXcOKM?si=6tRWLgc_AtCEnVGn', 
      thumbnail: 'https://img.youtube.com/vi/O7JkFJXcOKM/0.jpg' 
    },
    { 
      title: 'Kako napraviti narukvice od plastičnih flaša', 
      link: 'https://youtu.be/e1ZHnVn-vPc?si=tbnYWMlzG9zEPEBK', 
      thumbnail: 'https://img.youtube.com/vi/e1ZHnVn-vPc/0.jpg' 
    },
    { 
      title: '10 divnih reciklažnih ideja', 
      link: 'https://youtu.be/HkHEJEzMKwc?feature=shared', 
      thumbnail: 'https://img.youtube.com/vi/HkHEJEzMKwc/0.jpg' 
    },
    { 
      title: '10 genijalnih reciklažnih ideja', 
      link: 'https://youtu.be/t6sf0fsh0Hs?si=j52ZFu6wHKG83p_g', 
      thumbnail: 'https://img.youtube.com/vi/t6sf0fsh0Hs/0.jpg' 
    },
    { 
      title: '38 kreativnih ideja za plastičnim flašama', 
      link: 'https://youtu.be/xEAOvFG1AmM?si=VgL0B6VQd0zp41Uz', 
      thumbnail: 'https://img.youtube.com/vi/xEAOvFG1AmM/0.jpg' 
    },
    { 
      title: 'Kako napraviti kućnu dekoraciju od starog papira', 
      link: 'https://youtu.be/GsrQRj94aFo?si=PTpdFfq6ggWkI-7F', 
      thumbnail: 'https://img.youtube.com/vi/GsrQRj94aFo/0.jpg' 
    },
    { 
      title: 'Kako napraviti papir od trave', 
      link: 'https://youtu.be/FOb34_s-K1M?si=qoCwLhG9hYX58iDq', 
      thumbnail: 'https://img.youtube.com/vi/FOb34_s-K1M/0.jpg' 
    },
    { 
      title: 'Kako napraviti držač za olovke od papira', 
      link: 'https://youtu.be/6LcSC62t4ow?si=feL0R1xmtC3Z4lw5', 
      thumbnail: 'https://img.youtube.com/vi/6LcSC62t4ow/0.jpg' 
    }
  ];
  

  const icons = ['recycling', 'public', 'favorite', 'eco', 'lightbulb', 'language', 'search'];

  const assignedIcons = useMemo(() => {
    return videoLinks.map(() => {
      const randomIndex = Math.floor(Math.random() * icons.length);
      return icons[randomIndex];
    });
  }, []);

  const handlePress = (url:string) => {
    setCurrentUrl(url);
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

  const getMode = async () => {
    const storedMode = await AsyncStorage.getItem('darkMode');
    if (storedMode === "true") {
      setDark(true);
    } else {
      setDark(false);
    }
  };

  const saveMode = async (mode: boolean) => {
    await AsyncStorage.setItem('darkMode', mode ? "true" : "false");
  };

  const toggleDarkMode = () => {
    setDark((prev) => {
      const newMode = !prev;
      saveMode(newMode);
      return newMode;
    });
  };

  useEffect(() => {
    getMode();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: dark ? '#124460' : 'white', 
    },
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      color: dark ? 'white' : '#124460', 
      marginTop: 30,
      marginBottom: 20,
      textAlign: 'center',
    },
    subheading: {
      fontSize: 20,
      color: dark ? 'white' : '#124460', 
      paddingBottom: 30,
      marginBottom: 30,
      textAlign: 'center',
      borderBottomColor: dark ? '#fff' : 'black', 
      borderBottomWidth: 2,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: dark ? 'white' : 'white', 
      borderColor: '#124460',
      borderWidth: 1,
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
      color: dark ? '#124462' : '#124460', 
    },
    iconWrapper: {
      position: 'absolute',
      right: 10,
      padding: 5,
    },
    postsContainer: {
      height: 300,
      borderRadius: 10,
      padding: 10,
      backgroundColor: dark ? '#1b5975' : '#fff', 
    },
    videoLink: {
      marginBottom: 15,
    },
    card: {
      padding: 15,
      backgroundColor: dark ? '#2f6d8c' : '#fff', 
      borderRadius: 12,
      borderWidth: 1,
      borderColor: dark ? '#34495e' : '#ddd', 
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: dark ? '#fff' : '#000',
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
      color: dark ? '#fff' : '#124460',
      fontWeight: 'bold',
      flexWrap: 'wrap',
      lineHeight: 22,
      textAlign: 'left',
    },
    noResults: {
      fontSize: 18,
      color: dark ? 'white' : '#124460',
      textAlign: 'center',
      marginTop: 20,
    },
  });

  return (
    <>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <>
      
      <BackNav />
      <View style={styles.container}>
        <Text style={styles.heading}>Ideje za ponovnu upotrebu materijala</Text>
        <Text style={styles.subheading}>
          Ovde možete pronaći kreativne ideje za ponovnu upotrebu materijala u svakodnevnom životu.
        </Text>

        <View style={styles.searchContainer}>
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
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

        <KeyboardAwareScrollView style={styles.postsContainer}>
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
            allowsFullscreenVideo={true}
          />
        </View>
      </View>
    </Modal>
    </>
  );
};

export default Icon2;
