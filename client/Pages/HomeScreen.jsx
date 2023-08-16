import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet, SafeAreaView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Grid, Col } from 'react-native-easy-grid';
import * as ImagePicker from 'expo-image-picker';
import COLORS from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MainContext } from '../Components/Context/MainContextProvider';
import TaskListModal from '../Components/Modals/TaskListModal';
import CountdownModal from '../Components/Modals/CountDownModal';

function HomeScreen() {
    const { userName, capitalizeFirstLetter, pendingTaskList, completedTaskList } = useContext(MainContext);
    const [userImage, setUserImage] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isCountdownModalVisible, setCountdownModalVisible] = useState(false);

    useEffect(() => {
        retrieveUserImage();
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

    const saveUserImage = async () => {
        try {
            if (userImage) {
                await AsyncStorage.setItem('userImage', userImage);
                Alert.alert('image saved successfully')
            } else {
                await AsyncStorage.removeItem('userImage');
            }
        } catch (error) {
            console.log('Error saving user image', error);
        }
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
    const handleModalVisible = () => {
        setModalVisible(!isModalVisible);
    };
    const handlePendingTasksPress = () => {
        setSelectedTask(pendingTaskList);
        handleModalVisible();
    };

    const handleCompletedTasksPress = () => {
        setSelectedTask(completedTaskList);
        handleModalVisible();
    };
    const handleCountdownPress = () => {
        setCountdownModalVisible(true);
    };
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.welcomeText}>Welcome {capitalizeFirstLetter(userName)}!</Text>
                    <TouchableOpacity onPress={handleImageSelection}>
                        {userImage ? (
                            <Image source={{ uri: userImage }} style={styles.userImage} />
                        ) : (
                            <Ionicons name="person-circle-outline" size={80} />
                        )}
                    </TouchableOpacity>
                </View>
                <Grid style={styles.gridContainer}>
                    <Col>
                        <TouchableOpacity onPress={handleCountdownPress}>
                            <View style={styles.boxTimeRemain}>
                                <Text style={styles.boxContnentText}>Time Remaining</Text>
                                <Text style={styles.boxText}>5 hours</Text>
                            </View>
                        </TouchableOpacity>
                    </Col>
                    <Col>
                        <TouchableOpacity onPress={handleCompletedTasksPress}>
                            <View style={[styles.box, { backgroundColor: '#7DE2D1' }]}>
                                <Text style={styles.boxContnentText}>{completedTaskList.length > 0 ? '🏆' + 'Tasks Completed' : 'Tasks Completed'} </Text>
                                <Text style={styles.boxText}>{completedTaskList.length}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handlePendingTasksPress} >
                            <View style={[styles.box, { backgroundColor: '#7DE2D1' }]}>
                                <Text style={styles.boxContnentText}>Tasks Remaining</Text>
                                <Text style={styles.boxText}>{pendingTaskList.length}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={[styles.box, { backgroundColor: '#7DE2D1' }]}>
                                <Text style={styles.boxContnentText}>Tasks Completed On Time</Text>
                                <Text style={styles.boxText}>7</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={[styles.box, { backgroundColor: '#7DE2D1' }]}>
                                <Text style={styles.boxContnentText}>Tasks Completed After Due</Text>
                                <Text style={styles.boxText}>3</Text>
                            </View>
                        </TouchableOpacity>
                    </Col>
                </Grid>
                {isModalVisible && (
                    <View>
                        <TaskListModal
                            isVisible={isModalVisible}
                            taskList={selectedTask}
                            onClose={handleModalVisible}
                            isPendingTasks={selectedTask === pendingTaskList} // Pass this prop
                        />

                    </View>
                )}
                {isCountdownModalVisible && (
                    <CountdownModal isVisible={isCountdownModalVisible} onClose={() => setCountdownModalVisible(false)} />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 15,
        backgroundColor: '#1d3557ff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 40,
    },
    welcomeText: {
        margin: 10,
        fontSize: 16,
        elevation: 15,
        borderRadius: 22,
        backgroundColor: COLORS.white,
        padding: 12,
        fontWeight: 'bold'
    },
    gridContainer: {
        padding: 10,
    },
    boxTimeRemain: {
        backgroundColor: COLORS.red,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        padding: 20,
        marginLeft: 10,
        width: '90%',
        height: 511,
    },
    box: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        padding: 20,
        marginBottom: 10,
        width: '100%',
        height: 120, // Adjust the height as needed
        backgroundColor: COLORS.primary, // Set the background color for the button-like appearance
    },
    boxText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#020000',
        fontWeight: 'bold',
        color: COLORS.white, // Set the text color to match the button background
    },
    boxContnentText: {
        fontWeight: 'bold',
        fontSize: 13,
        textDecorationLine: 'underline',
        textAlign: 'center', // Center-align the text horizontally
        alignItems: 'center', // Center-align vertically
        justifyContent: 'center', // Center-align horizontally
        letterSpacing: 1
    },

    modalContainer: {

        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalInerContainer: {
        alignItems: 'center',
        justifyContent: "center",
    }


});

export default HomeScreen;
