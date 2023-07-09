import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImgSTX() {
  const [pickedImagePath, setPickedImagePath] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const showImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setPickedImagePath(result.uri);
      console.log(result.uri);
    }
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality:1,
    });

    if (!result.canceled) {
      setPickedImagePath(result.uri);
      console.log(result.uri);
    }
  };

  return (
    // <View style={styles.screen}>
    <View>
      <View
        style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={openCamera
          } style={styles.button}>
          <Text
            style={styles.buttonText}>Open Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={showImagePicker}
          style={styles.button} >
          <Text
            style={styles.buttonText}>Select an Image
          </Text>
        </TouchableOpacity>

      </View>

      <View style={styles.imageContainer}>
        {pickedImagePath !== '' && (
          <Image source={{ uri: pickedImagePath }} style={styles.image} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    margin: 80,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  buttonContainer: {
    justifyContent: 'space-between',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#917FB3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
});
