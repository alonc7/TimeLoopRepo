import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Grid, Col } from 'react-native-easy-grid';
import * as ImagePicker from 'expo-image-picker';
import COLORS from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MainContext } from '../Components/Context/MainContextProvider';
import Charts from '../Components/Charts';


function HomeScreen() {
    const [userImage, setUserImage] = useState(null);
    const { userName, setUserName, userEmail, setUserEmail, capitalizeFirstLetter, handleImageSelection } = useContext(MainContext);


    useEffect(() => {
        // removeDataFromAsyncStorage();
        retrieveUserImage();
        retrieveUserData();
    }, []);
    const retrieveUserImage = async () => {
        try {
            const imageUri = await AsyncStorage.getItem('userImage');
            if (imageUri !== null) {
                setUserImage(imageUri);
            }
        } catch (error) {
            console.log('Error retrieving user image', error);
        }
    };
    const retrieveUserData = async () => {
        try {
            const userDataString = await AsyncStorage.getItem('userData');
            if (userDataString !== null) {
                const userData = await JSON.parse(userDataString);
                setUserName(userData.name);
            }
        } catch (error) {
            console.log(userDataString.email);
            console.log('this is also  Error retrieving user data:', error);
        }
    };
    // const removeDataFromAsyncStorage = async () => {
    //     try {
    //         await AsyncStorage.removeItem('userData');
    //         console.log('User data removed successfully.');
    //     } catch (error) {
    //         console.log('Error removing user data:', error);
    //     }
    // };
    // const saveUserImage = async () => {
    //     try {
    //         if (userImage) {
    //             await AsyncStorage.setItem('userImage', userImage);
    //             console.log('user image saved successfully');
    //         } else
    //             await AsyncStorage.removeItem('userImage');
    //     } catch (error) {
    //         console.log('Error saving user image', error);
    //     }
    // }
    // const openImagePicker = async () => {
    //     try {
    //         const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    //         if (!permissionResult.granted) {
    //             Alert.alert('Permission Denied', 'Please grant camera roll permissions to select an image.');
    //             return;
    //         }

    //         const pickerResult = await ImagePicker.launchImageLibraryAsync();

    //         if (!pickerResult.canceled) {
    //             setUserImage(pickerResult.assets[0].uri);
    //             saveUserImage(pickerResult.assets[0].uri);
    //         }
    //     } catch (error) {
    //         console.log('Error picking an image:', error);
    //     }
    // };

    // const openCamera = async () => {
    //     try {
    //         const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    //         if (!permissionResult.granted) {
    //             Alert.alert('Permission Denied', 'Please grant camera permissions to take a photo.');
    //             return;
    //         }

    //         const cameraResult = await ImagePicker.launchCameraAsync();

    //         if (!cameraResult.canceled) {
    //             setUserImage(cameraResult.assets[0].uri);
    //             saveUserImage(cameraResult.assets[0].uri);
    //             console.log('gets to saveUserImage');
    //         }
    //     } catch (error) {
    //         console.log('Error taking a photo:', error);
    //     }
    // };

    // const handleImageSelection = () => {
    //     Alert.alert(
    //         'Choose Image Source',
    //         'Select the source for the user image',
    //         [
    //             {
    //                 text: 'Cancel',
    //                 style: 'cancel',
    //             },
    //             {
    //                 text: 'Gallery',
    //                 onPress: openImagePicker,
    //             },
    //             {
    //                 text: 'Camera',
    //                 onPress: openCamera,
    //             },

    //         ],
    //     );
    // };
 
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={handleImageSelection}>
                            {userImage ? (
                                <Image source={{ uri: userImage }} style={styles.userImage} />
                            ) : (
                                <Ionicons name="person-circle-outline" size={80} />
                            )}
                        </TouchableOpacity>
                        <Text style={styles.welcomeText}>Welcome {capitalizeFirstLetter(userName)}!</Text>
                    </View>
                    <Grid style={styles.gridContainer}>
                        <Col>
                            <TouchableOpacity >
                                <View style={styles.boxTimeRemain}>
                                    <Text>Total Time of Remaining Tasks</Text>
                                    <Text style={styles.boxText}>5 hours</Text>
                                </View>
                            </TouchableOpacity>
                        </Col>
                        <Col>
                            <TouchableOpacity >
                                <View style={[styles.box, { backgroundColor: '#7B1FA2' }]}>
                                    <Text>Tasks Completed</Text>
                                    <Text style={styles.boxText}>4</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity >
                                <View style={[styles.box, { backgroundColor: '#4CAF50' }]}>
                                    <Text>Tasks Remaining</Text>
                                    <Text style={styles.boxText}>3</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity >
                                <View style={[styles.box, { backgroundColor: '#FFEB3B' }]}>
                                    <Text>Tasks Completed On Time</Text>
                                    <Text style={styles.boxText}>7</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity >
                                <View style={[styles.box, { backgroundColor: '#FF9800' }]}>
                                    <Text>Tasks Completed After Due</Text>
                                    <Text style={styles.boxText}>3</Text>
                                </View>
                            </TouchableOpacity>
                        </Col>
                    </Grid>
                </View>
                <View>
                    <Charts />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 15,
        backgroundColor: COLORS.secondary,
    },
    gridContainer: {
        padding: 10,

    },
    boxTimeRemain: {
        backgroundColor: '#F44336',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        padding: 20,
        marginLeft: 10,
        width: '90%',
        height:511,

    },
    box: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        padding: 20,
        marginBottom: 10,
        width: '100%',
        height: 120,
    },
    boxText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#020000'
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    userImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    welcomeText: {
        marginLeft: 10,
        fontSize: 18,
        elevation: 15,
        borderRadius: 22,
        backgroundColor: COLORS.secondary,
        padding: 15
    },
});

export default HomeScreen;
