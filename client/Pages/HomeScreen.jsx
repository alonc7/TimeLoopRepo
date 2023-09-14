import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Alert,
    StyleSheet,
    SafeAreaView,
    Dimensions,
    FlatList
} from 'react-native'; // Import necessary components from React Native
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons for icons
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker from Expo
import COLORS from '../constants/colors'; // Import custom color constants
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage for data storage
import { MainContext } from '../Components/Context/MainContextProvider'; // Import MainContext from a custom context provider
import TaskListModal from '../Components/Modals/TaskListModal'; // Import a custom TaskListModal component
import CountdownModal from '../Components/Modals/CountDownModal'; // Import a custom CountdownModal component

// Get the device screen width and define a box width as a fraction of it
const { width } = Dimensions.get('window');
const boxWidth = width * 0.4;

// Define the HomeScreen component
function HomeScreen() {
    // Context API: Access data and functions from the MainContextProvider
    const {
        userName,
        capitalizeFirstLetter,
        pendingTaskList,
        completedTaskList,
        deletedTasksList,
        getTodayTasks,
        getCurrentWeekTasks,
        getTaskListType
    } = useContext(MainContext);

    // State variables used in the component
    const [userImage, setUserImage] = useState(null); // User's profile image
    const [isModalVisible, setModalVisible] = useState(false); // Modal visibility
    const [selectedTask, setSelectedTask] = useState(null); // Selected task data
    const [isCountdownModalVisible, setCountdownModalVisible] = useState(false); // Countdown modal visibility
    const [showTodayTasks, setShowTodayTasks] = useState(false); // Toggle display of today's tasks
    const [showCurrWeekTasks, setShowCurrWeekTasks] = useState(false); // Toggle display of current week's tasks
    const taskListType = getTaskListType(selectedTask, pendingTaskList, completedTaskList, deletedTasksList);

    useEffect(() => {
        // Load the user's profile image when the component mounts
        retrieveUserImage();
    }, [userImage]);

    // Function: toggleTodayTasks
    // Purpose: Toggles the display of today's tasks in the component.
    const toggleTodayTasks = () => {
        setShowTodayTasks(!showTodayTasks);
    }




    // Function: toggleCurrWeekTasks
    // Purpose: Toggles the display of current week's tasks in the component.
    const toggleCurrWeekTasks = () => {
        setShowCurrWeekTasks(!showCurrWeekTasks);
    }

    // Function: retrieveUserImage
    // Purpose: Retrieves the user's profile image from AsyncStorage and sets it in the component's state.
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

    // Function: saveUserImage
    // Purpose: Saves the user's profile image in AsyncStorage and displays an alert upon successful save.
    const saveUserImage = async (newImageUri) => {
        try {
            if (newImageUri) {
                await AsyncStorage.setItem('userImage', newImageUri);
                Alert.alert('Image saved successfully')
            } else {
                await AsyncStorage.removeItem('userImage');
            }
        } catch (error) {
            console.log('Error saving user image', error);
        }
    };
    // Function: openImagePicker
    // Purpose: Opens the image picker, allowing the user to select an image from the gallery.
    const openImagePicker = async () => {
        try {
            // Request permission to access the device's media library.
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permissionResult.granted) {
                Alert.alert('Permission Denied', 'Please grant camera roll permissions to select an image.');
                return;
            }

            // Launch the image picker and set the selected image as the user's profile image.
            const pickerResult = await ImagePicker.launchImageLibraryAsync();

            if (!pickerResult.canceled) {
                saveUserImage(pickerResult.assets[0].uri);
                setUserImage(pickerResult.assets[0].uri);
                console.log('Successfully saved user image from Gallery');
            }
        } catch (error) {
            console.log('Error picking an image:', error);
        }
    };

    // Function: openCamera
    // Purpose: Opens the device's camera, allowing the user to take a photo.
    const openCamera = async () => {
        try {
            // Request permission to access the device's camera.
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

            if (!permissionResult.granted) {
                Alert.alert('Permission Denied', 'Please grant camera permissions to take a photo.');
                return;
            }

            // Launch the camera and set the captured image as the user's profile image.
            const cameraResult = await ImagePicker.launchCameraAsync();

            if (!cameraResult.canceled) {
                setUserImage(cameraResult.assets[0].uri);
                saveUserImage(cameraResult.assets[0].uri);
            }
        } catch (error) {
            console.log('Error taking a photo:', error);
        }
    };

    // Function: handleImageSelection
    // Purpose: Displays an alert to let the user choose between selecting an image from the gallery or taking a photo with the camera.
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

    // Function: handleModalVisible
    // Purpose: Toggles the visibility of a modal in the component.
    const handleModalVisible = () => {
        setModalVisible(!isModalVisible);
    };

    // Function: handlePendingTasksPress
    // Purpose: Sets the selected task list to pending tasks and toggles the visibility of a modal in the component.
    const handlePendingTasksPress = () => {
        setSelectedTask(pendingTaskList);
        handleModalVisible();
    };

    // Function: handleCompletedTasksPress
    // Purpose: Sets the selected task list to completed tasks and toggles the visibility of a modal in the component.
    const handleCompletedTasksPress = () => {
        setSelectedTask(completedTaskList);
        handleModalVisible();
    };

    const handleDeletedTaskPress = () => {
        setSelectedTask(deletedTasksList);
        handleModalVisible();

    }

    // Function: handleCountdownPress
    // Purpose: Opens a countdown modal in the component.
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
                        <TouchableOpacity on onPress={toggleTodayTasks} style={styles.toggleButton}>
                            <Text>Today's Tasks:{showTodayTasks ? '▲' : '▼'}</Text>
                        </TouchableOpacity>
                        {showTodayTasks && (
                            <FlatList // this flat list is to dispay tasks of today. 
                                data={getTodayTasks()}
                                keyExtractor={(index) => index.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity>
                                        <View style={[styles.box, { backgroundColor: '#7DE2D1' }]}>
                                            <Text style={styles.boxContnentText}>{item.title}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        )}
                        <TouchableOpacity on onPress={toggleCurrWeekTasks} style={styles.toggleButton}>
                            <Text>This Week Tasks:{showCurrWeekTasks ? '▲' : '▼'}</Text>
                        </TouchableOpacity>
                        {showCurrWeekTasks && (
                            <FlatList // this flat list is to dispay tasks of today. 
                                data={getCurrentWeekTasks()}
                                keyExtractor={(item, index) => item._id || index.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity>
                                        <View style={[styles.box, { backgroundColor: '#7DE2D1' }]}>
                                            <Text style={styles.boxContnentText}>{item.title}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        )}
                        <View >
                            <FlatList
                                data={() => getCurrentWeekTasks()}
                                keyExtractor={(item, index) => item._id || index.toString()}
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
                        <TouchableOpacity onPress={handleDeletedTaskPress}>
                            <View style={[styles.box, { backgroundColor: '#7DE2D1' }]}>
                                <Text style={styles.boxContnentText}>Tasks  Deleted</Text>
                                <Text style={styles.boxText}>{deletedTasksList.length}</Text>
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
                            taskListType={taskListType}
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
        // padding: 4
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
        backgroundColor: COLORS.white,
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
        color: 'COLORS.white',
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
    toggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: 'white'
    }
});


export default HomeScreen;
