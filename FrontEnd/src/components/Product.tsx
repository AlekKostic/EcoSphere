import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importing the icons

const Product = ({ item, dark }) => {
  const router = useRouter();

  // Navigate to Product Details screen
  const handlePressDetails = () => {
    router.push({ pathname: '/ProductDetails', query: { item: JSON.stringify(item) } });
  };

  // Handle bookmark press (could be used to save the product later)
  const handleBookmarkPress = () => {
    console.log('Bookmark pressed for', item.name);
    // Add functionality to save the product (e.g., add to favorites or cart)
  };

  const viewCount = item.viewCount || 0; // Default to 0 if no view count is provided

  return (
    <View style={[styles.productContainer, { backgroundColor: dark ? '#2f6d8c' : '#fff' }]}>
      {/* Save Icon - Top-left corner */}
      <TouchableOpacity onPress={handleBookmarkPress} style={styles.saveIconContainer}>
        <Icon name="bookmark-border" size={24} color={dark ? 'white' : '#124460'} />
      </TouchableOpacity>

      {item.path && <Image source={{ uri: item.path }} style={styles.productImage} />}
      <View style={styles.productDetails}>
        <Text style={[styles.productName, { color: dark ? 'white' : "#124460" }]}>{item.name}</Text>
        <Text style={[styles.productDescription, { color: dark ? 'white' : "#124460" }]}>{item.description}</Text>
        
        {/* Eye icon and view count */}
        <View style={styles.viewSection}>
          <Icon name="visibility" size={20} color={dark ? 'white' : "#124460"} />
          <Text style={[styles.viewCountText, { color: dark ? 'white' : "#124460" }]}>{viewCount}</Text>
        </View>
      </View>
      
      {/* Footer with "Pogledajte detaljnije" at the bottom-right */}
      <TouchableOpacity onPress={handlePressDetails} style={styles.footer}>
        <Text style={[styles.viewDetailsText, { color: dark ? 'white' : "#124460" }]}>Pogledajte detaljnije</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  productContainer: {
    backgroundColor: '#fff',
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: 'row', // Align image and text side by side
    padding: 15, // Add more padding to space out the content
    position: 'relative', // Enable positioning of footer
  },
  saveIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1, // Ensure the save icon is above the other components
  },
  productImage: {
    width: 100, // Make the image slightly larger
    height: 100,
    borderRadius: 10,
    marginRight: 20, // Space between image and details
  },
  productDetails: {
    flex: 1, // Take up remaining space
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  viewSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewCountText: {
    fontSize: 14,
    marginLeft: 5,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline', // Make it look like a clickable link
  },
  footer: {
    position: 'absolute', // Position it at the bottom-right corner
    bottom: 15,
    right: 15,
  },
});

export default Product;
