import React, { createContext, useState } from 'react'
export const MainContext = createContext()

function MainContextProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [taskList, setTaskList] = useState([]); // array of tasks 

  //HomeScreen method
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const openImagePicker = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Permission Denied', 'Please grant camera roll permissions to select an image.');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync();

      if (!pickerResult.canceled) {
        setUserImage(pickerResult.assets[0].uri);
        saveUserImage(pickerResult.assets[0].uri);
      }
    } catch (error) {
      console.log('Error picking an image:', error);
    }
  };

  const openCamera = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Permission Denied', 'Please grant camera permissions to take a photo.');
        return;
      }

      const cameraResult = await ImagePicker.launchCameraAsync();

      if (!cameraResult.canceled) {
        setUserImage(cameraResult.assets[0].uri);
        saveUserImage(cameraResult.assets[0].uri);
        console.log('gets to saveUserImage');
      }
    } catch (error) {
      console.log('Error taking a photo:', error);
    }
  };

  const handleImageSelection = () => {
    Alert.alert(
      'Choose Image Source',
      'Select the source for the user image',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Gallery',
          onPress: openImagePicker,
        },
        {
          text: 'Camera',
          onPress: openCamera,
        },

      ],
    );
  };
  const removeDataFromAsyncStorage = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      console.log('User data removed successfully.');
    } catch (error) {
      console.log('Error removing user data:', error);
    }
  };
  const saveUserImage = async () => {
    try {
      if (userImage) {
        await AsyncStorage.setItem('userImage', userImage);
        console.log('user image saved successfully');
      } else
        await AsyncStorage.removeItem('userImage');
    } catch (error) {
      console.log('Error saving user image', error);
    }
  }
  const MainContextValues = {
    isLoading,
    setIsLoading,
    setAuthenticated,
    authenticated,
    setUserName,
    userName,
    userId,
    setUserId,
    userEmail,
    setUserEmail,
    capitalizeFirstLetter,
    handleImageSelection,
    openCamera,
    openImagePicker,

  }
  return (
    <MainContext.Provider value={MainContextValues}>
      {children}
    </MainContext.Provider>
  )
}
export default MainContextProvider;



