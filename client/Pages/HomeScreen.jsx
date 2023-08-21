import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet, SafeAreaView, Dimensions, FlatList } from 'react-native'; // Added Dimensions
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import COLORS from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MainContext } from '../Components/Context/MainContextProvider';
import TaskListModal from '../Components/Modals/TaskListModal';
import CountdownModal from '../Components/Modals/CountDownModal';

const { width} = Dimensions.get('window');
const boxWidth = width * 0.4;
function HomeScreen() {
    const { userName, capitalizeFirstLetter, pendingTaskList, completedTaskList, allTasks, getTodayTasks, getCurrentWeekTasks } = useContext(MainContext);
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
                    <View style={styles.welcomeContainer}>
                        <Text style={styles.welcomeText}>Welcome {capitalizeFirstLetter(userName)}!</Text>
                    </View>
                    <TouchableOpacity onPress={handleImageSelection}>
                        <View style={styles.userImageContainer}>
                            {userImage ? (
                                <Image source={{ uri: userImage }} style={styles.userImage} />
                            ) : (
                                <Ionicons name="person-circle-outline" size={80} color={COLORS.grey} />
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.bubbleContainer}>
                    <View style={styles.bubble}>
                        {/* <View style={styles.bubble}> */}
                        <FlatList
                            data={() => getTodayTasks()}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity>
                                    <View style={[styles.box, { backgroundColor: '#7DE2D1' }]}>
                                        <Text style={styles.boxContnentText}>{item.title}</Text>
                                        {/* Display other task information */}
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                        <View >
                            <FlatList
                                data={() => getCurrentWeekTasks()}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity>
                                        <View style={[styles.box, { backgroundColor: '#7DE2D1' }]}>
                                            <Text style={styles.boxContnentText}>{item.title}</Text>
                                            {/* Display other task information */}
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.gridContainer}>
                    <View style={styles.gridRow}>
                        <TouchableOpacity onPress={handleCompletedTasksPress} style={styles.boxButton}>
                            <View style={[styles.box, { backgroundColor: '#7DE2D1' }]}>
                                <Text style={styles.boxContnentText}>
                                    {completedTaskList.length > 0 ? '🏆' + 'Tasks Completed' : 'Tasks Completed'}
                                </Text>
                                <Text style={styles.boxText}>{completedTaskList.length}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handlePendingTasksPress} style={styles.boxButton}>
                            <View style={[styles.box, { backgroundColor: '#7DE2D1' }]}>
                                <Text style={styles.boxContnentText}>Tasks Remaining</Text>
                                <Text style={styles.boxText}>{pendingTaskList.length}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.gridRow}>
                        <TouchableOpacity>
                            <View style={[styles.box, { backgroundColor: '#7DE2D1' }]}>
                                <Text style={styles.boxContnentText}>Tasks Completed After Due</Text>
                                <Text style={styles.boxText}>3</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={[styles.box, { backgroundColor: '#7DE2D1' }]}>
                                <Text style={styles.boxContnentText}>Tasks Completed On Time</Text>
                                <Text style={styles.boxText}>7</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.timeRemainingContainer}>
                    <TouchableOpacity
                        onPress={handleCountdownPress}
                        style={styles.remainingTimeButton}
                    >
                        <Ionicons name="time-outline" size={24} color={COLORS.white} />
                        <Text style={styles.remainingTimeButtonText}>
                            Time Remaining for pending tasks
                        </Text>
                    </TouchableOpacity>
                </View>
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
        backgroundColor: COLORS.secondary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    userImageContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: COLORS.lightGrey,
        alignItems: 'center',
        justifyContent: 'center',
    },
    userImage: {
        width: '100%',
        height: '100%',
    },
    welcomeContainer: {
        flex: 1,
        paddingRight: 10,
    },
    welcomeText: {
        alignSelf: 'center',
        margin: 10,
        fontSize: 16,
        elevation: 15,
        borderRadius: 22,
        backgroundColor: COLORS.white,
        padding: 12,
        fontWeight: 'bold',
    },
    bubbleContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    bubble: {
        backgroundColor: COLORS.primary,
        borderRadius: 20,
        padding: 10,
        flexDirection: 'column', // Changed from 'row' to 'column'
        justifyContent: 'space-between',
        width: '80%',
    },
    // bubbleTextContainer: {
    //     marginBottom: 10, // Added margin between bubble text items
    // },
    bubbleText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: 'bold',
    },
    gridContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    gridRow: {
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    boxButton: {
        flex: 1,
        alignItems: 'center',
    },
    timeRemainingContainer: {
        alignSelf: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    remainingTimeButton: {
        top: 70,
        backgroundColor: COLORS.red,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        flexDirection: 'row', // Align icon and text horizontally
        alignItems: 'center', // Align items vertically
    },
    remainingTimeButtonText: {
        marginLeft: 10, // Add space between icon and text
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    box: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        width: boxWidth,
        height: boxWidth * 0.7,
        backgroundColor: COLORS.primary,
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
        letterSpacing: 1,
    },
    // ... (other styles)
});


export default HomeScreen;
