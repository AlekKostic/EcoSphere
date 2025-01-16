import { View, Text, Linking, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import React, { useState } from 'react';
import BackNav from '../components/Backnav';

const icon2 = () => {
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  const videoLinks = [
    { title: 'Radionica "Reciklaža nije gnjavaža" za decu', link: 'https://www.tiktok.com/@mojsvetns/video/7435042170282806584' },
    { title: 'Common Waste - Common Libraries - Goethe-Institut Srbija', link: 'https://www.goethe.de/ins/cs/sr/kul/sup/cnw.html' },
    { title: 'Uvođenje sistema reciklaže i ekološko obrazovanje', link: 'https://openjicareport.jica.go.jp/pdf/1000052997_02.pdf' },
    { title: 'Eko aktivnosti - Oaza znanja', link: 'https://nvooazaznanja.wordpress.com/wp-content/uploads/2019/05/eko-aktivnosti.pdf' },
    { title: 'U deset škola mašine za reciklažu plastike i 3D štampači', link: 'https://rtcg.me/vijesti/drustvo/442210/u-deset-skola-masine-za-reciklazu-plastike-i-3d-stampaci.html' },
    { title: 'Gimnazija u Tutinu obilježila Dan reciklaže', link: 'https://www.instagram.com/p/C4tAlCsILJ3/' },
    { title: 'Niz besplatnih programa u omladinskom centru CK13', link: 'https://www.021.rs/story/ZIPA-info/CK-13/93115/Niz-besplatnih-programa-u-omladinskom-centru-CK13.html' },
    { title: 'Vodič za smanjenje generisanja otpada i uticaja na životnu sredinu', link: 'https://reciklaza.biz/rec-struke/vodic-za-smanjenje-generisanja-otpada-i-uticaja-na-zivotnu-sredinu/' },
    { title: 'Reciklaža: stvar ekološke svesti ili potencijalni didaktički materijal', link: 'https://www.mayflower.rs/reciklaza-stvar-ekoloske-svesti-ili-potencijalni-didakticki-material/' },
    { title: 'Pojam i značaj reciklaže', link: 'https://www.scribd.com/document/517427643/Pojam-i-Zna%C4%8Daj-Recikla%C5%BEe' },
    { title: 'Zabavna Reciklaža II - Reciklirajmo zajedno AIESEC', link: 'https://www.subotica.com/desavanja/08.maj.2012.zabavna-reciklaza-ii-reciklirajmo-zajedno-aiesec-id4112.html' },
    { title: 'EkoSistem - Podržani projekti 2024', link: 'https://ekosistem.mis.org.rs/podrzani-projekti-2024/' },
    { title: 'O nastavnom planu i programu ogleda za obrazovni profil tehničar za reciklažu', link: 'https://demo.paragraf.rs/demo/combined/Old/t/t2015_08/t08_0241.htm' },
    { title: 'Angažovanje i edukacija građana - Europa.rs', link: 'https://europa.rs/images/publikacije/Angazovanje-i-edukacija.pdf' },
    { title: 'Reciklaža u Srbiji: Stanje i perspektive', link: 'https://www.ekologija.gov.rs/sites/default/files/reciklaza_u_srbiji.pdf' },
    { title: 'Edukativni materijali o reciklaži za osnovne škole', link: 'https://www.osnovneskole.edu.rs/edukativni-materijali/reciklaza' },
    { title: 'Kako pravilno reciklirati elektronski otpad', link: 'https://www.tehnomanija.rs/blog/reciklaža-elektronskog-otpada' },
    { title: 'Zelena Srbija - Inicijative za reciklažu i očuvanje životne sredine', link: 'https://www.zelenasrbija.rs/reciklaza' },
    { title: 'Eko kampanje i radionice o reciklaži u lokalnim zajednicama', link: 'https://www.lokalnevesti.rs/eko-kampanje-reciklaza' },
    { title: 'Priručnik za reciklažu plastike u kućnim uslovima', link: 'https://www.plastika.rs/prirucnik-za-reciklazu' },
    { title: 'Edukativni video: Proces reciklaže papira', link: 'https://www.youtube.com/watch?v=example1' },
    { title: 'Dokumentarni film: Reciklaža metala i njen značaj', link: 'https://www.youtube.com/watch?v=example2' },
    { title: 'Kako funkcioniše reciklaža stakla - Edukativni video', link: 'https://www.youtube.com/watch?v=example3' },
    { title: 'Eko škola: Programi edukacije o reciklaži za decu', link: 'https://www.ekoskola.edu.rs/programi/reciklaza' },
    { title: 'NVO Oaza znanja - Projekti o zaštiti životne sredine', link: 'https://nvooazaznanja.wordpress.com/projekti/eko-aktivnosti' },
    { title: 'Reciklaža tekstila: Vodič za ponovnu upotrebu odeće', link: 'https://www.modnireciklaza.rs/vodic' },
    { title: 'Edukativni centar Kruševac - Radionice o reciklaži', link: 'https://www.edukacijakv.rs/radionice/reciklaza' },
    { title: 'Kako smanjiti upotrebu plastike u svakodnevnom životu', link: 'https://www.zivotbezplastike.rs/saveti' },
    { title: 'Eko forum Subotica - Inicijative za reciklažu u lokalnoj zajednici', link: 'https://www.ekoforumsubotica.rs/projekti/reciklaza' },
    { title: 'Pravilno odlaganje baterija i elektronskog otpada', link: 'https://www.elektroreciklaža.rs/saveti' },
    { title: 'Niz besplatnih programa u omladinskom centru CK13', link: 'https://www.021.rs/story/ZIPA-info/CK-13/93115/Niz-besplatnih-programa-u-omladinskom-centru-CK13.html' },
    { title: 'Vodič za smanjenje generisanja otpada i uticaja na životnu sredinu', link: 'https://reciklaza.biz/rec-struke/vodic-za-smanjenje-generisanja-otpada-i-uticaja-na-zivotnu-sredinu/' },
    { title: 'Reciklaža: stvar ekološke svesti ili potencijalni didaktički materijal', link: 'https://www.mayflower.rs/reciklaza-stvar-ekoloske-svesti-ili-potencijalni-didakticki-material/' },
    { title: 'Pojam i značaj reciklaže', link: 'https://www.scribd.com/document/517427643/Pojam-i-Zna%C4%8Daj-Recikla%C5%BEe' },
    { title: 'Zabavna Reciklaža II - Reciklirajmo zajedno AIESEC', link: 'https://www.subotica.com/desavanja/08.maj.2012.zabavna-reciklaza-ii-reciklirajmo-zajedno-aiesec-id4112.html' },
    { title: 'EkoSistem - Podržani projekti 2024', link: 'https://ekosistem.mis.org.rs/podrzani-projekti-2024/' },
    { title: 'O nastavnom planu i programu ogleda za obrazovni profil tehničar za reciklažu', link: 'https://demo.paragraf.rs/demo/combined/Old/t/t2015_08/t08_0241.htm' },
    { title: 'Angažovanje i edukacija građana - Europa.rs', link: 'https://europa.rs/images/publikacije/Angazovanje-i-edukacija.pdf' },
    { title: 'Reciklaža u Srbiji: Stanje i perspektive', link: 'https://www.ekologija.gov.rs/sites/default/files/reciklaza_u_srbiji.pdf' },
    { title: 'Edukativni materijali o reciklaži za osnovne škole', link: 'https://www.osnovneskole.edu.rs/edukativni-materijali/reciklaza' },
    { title: 'Kako pravilno reciklirati elektronski otpad', link: 'https://www.tehnomanija.rs/blog/reciklaža-elektronskog-otpada' },
    { title: 'Zelena Srbija - Inicijative za reciklažu i očuvanje životne sredine', link: 'https://www.zelenasrbija.rs/reciklaza' },
    { title: 'Eko kampanje i radionice o reciklaži u lokalnim zajednicama', link: 'https://www.lokalnevesti.rs/eko-kampanje-reciklaza' },
    { title: 'Priručnik za reciklažu plastike u kućnim uslovima', link: 'https://www.plastika.rs/prirucnik-za-reciklazu' },
    { title: 'Edukativni video: Proces reciklaže papira', link: 'https://www.youtube.com/watch?v=example1' },
    { title: 'Dokumentarni film: Reciklaža metala i njen značaj', link: 'https://www.youtube.com/watch?v=example2' },
    { title: 'Kako funkcioniše reciklaža stakla - Edukativni video', link: 'https://www.youtube.com/watch?v=example3' },
    { title: 'Eko škola: Programi edukacije o reciklaži za decu', link: 'https://www.ekoskola.edu.rs/programi/reciklaza' },
    { title: 'NVO Oaza znanja - Projekti o zaštiti životne sredine', link: 'https://nvooazaznanja.wordpress.com/projekti/eko-aktivnosti' },
    { title: 'Reciklaža tekstila: Vodič za ponovnu upotrebu odeće', link: 'https://www.modnireciklaza.rs/vodic' },
    { title: 'Edukativni centar Kruševac - Radionice o reciklaži', link: 'https://www.edukacijakv.rs/radionice/reciklaza' },
    { title: 'Kako smanjiti upotrebu plastike u svakodnevnom životu', link: 'https://www.zivotbezplastike.rs/saveti' },
    { title: 'Eko forum Subotica - Inicijative za reciklažu u lokalnoj zajednici', link: 'https://www.ekoforumsubotica.rs/projekti/reciklaza' },
    { title: 'Pravilno odlaganje baterija i elektronskog otpada', link: 'https://www.elektroreciklaža.rs/saveti' },
    { title: 'Edukativni video: Kako reciklirati ambalažu', link: 'https://www.youtube.com/watch?v=example4' },
    { title: 'Uloga reciklaže u smanjenju globalnog zagrevanja', link: 'https://www.youtube.com/watch?v=example5' },
    { title: 'Zašto je važno reciklirati staklo?', link: 'https://www.youtube.com/watch?v=example6' },
    { title: 'Reciklaža na globalnom nivou: Uloga zajednice', link: 'https://www.youtube.com/watch?v=example7' },
    { title: 'Inovacije u reciklaži plastike - Tokom 2024. godine', link: 'https://www.youtube.com/watch?v=example8' },
    { title: 'Edukativni video o kompostiranju - reciklaža organskog otpada', link: 'https://www.youtube.com/watch?v=example9' }
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
