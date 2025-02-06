import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native'
import React from 'react'

const imageWidth = Dimensions.get('window').width * 0.9; 
const imageHeight = imageWidth * 0.8;

const ExtendedProduct = ({item, dark, ime, prezime, profileImageSource, handleUser}) => {
  return (
    <View  style={[{marginBottom:30}]} >
      <TouchableOpacity onPress={()=>handleUser()}>
        <View style={styles.userSection}>
            <Image source={profileImageSource} style={styles.profilePic} />
            <Text style={[styles.userName, { color: dark ? 'white' : '#124460' }]}>{ime} {prezime}</Text>
            
        </View>
        </TouchableOpacity>
        <Text style={[styles.contact, { color: dark ? 'white' : '#124460' }]}>
            {"Kontakt telefon: " + item.phone_number}
        </Text>
        <Image source={item.path ? { uri: item.path } : require('../img/pathnull.png')} style={styles.modalImage} />
        <Text style={[styles.modalTitle, { color: dark ? 'white' : '#124460' }]}>{item.name}</Text>
        <Text style={[styles.modalDescription, { color: dark ? 'white' : '#124460' }]}>{item.description}</Text>
                
    </View>
  )
}

const styles = StyleSheet.create({
    userSection: {
        flexDirection: 'row', 
        alignItems: 'center',  
        marginTop: 10,         
        marginLeft: 30, 
      },profilePic: {
        height: 50,
        width: 50,
        borderRadius: 50,
        borderWidth:1,
        borderColor:'#124460'
      },
      userName: {
        marginLeft:10,
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
      }, contact:{
        marginTop:15,
        fontSize:18,
        marginLeft:30,
        fontWeight: '400',
        marginBottom:20,
      },modalImage: {
        width: imageWidth, 
        height: imageHeight,
        alignSelf: 'center',
      },modalTitle: {
        alignSelf:'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop:20,
        marginBottom: 20,
      },
      modalDescription: {
        paddingHorizontal:30,
        fontSize: 16,
        marginBottom: 20,
      },

})

export default ExtendedProduct