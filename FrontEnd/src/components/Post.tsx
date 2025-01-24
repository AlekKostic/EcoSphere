import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import axios from 'axios'

const Post = ({item, likePost, index}) => {

  const router = useRouter()

  const onAuthorPress = (author) => {
    console.log("Kliknuto na autora:", author);
    router.push({
      pathname: '/UserInfo',
      params: { personal: false, id:item.authorId },
    })
  };
  


  return (
    <View style={styles.postContainer}>

    <TouchableOpacity onPress={onAuthorPress}>
      <Text style={styles.profileText}>{item.author.ime + " " + item.author.prezime} </Text>
      
    </TouchableOpacity>
      <Text style={styles.postText}>{item.content}</Text>
      <View style={styles.likeContainer}>
        <TouchableOpacity onPress={() => likePost(item)} style={styles.likeButton}>
          <MaterialCommunityIcons
            name={item.liked ? 'heart' : 'heart-outline'}
            size={24}
            color={item.liked ? 'red' : '#aaa'}
          />
        </TouchableOpacity>
        <Text style={styles.likesCount}>{item.likes}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({

    postContainer: {
        backgroundColor: '#fff',
        margin: 10,
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
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
})

export default Post