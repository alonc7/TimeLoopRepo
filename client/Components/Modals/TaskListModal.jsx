import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Pressable, Vibration } from 'react-native'; // Import necessary components
import { Modal, } from 'react-native';
import COLORS from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { MainContext } from '../Context/MainContextProvider';
import EditTaskModal from './EditTaskModal'; // Import the EditTaskModal component

import axios from 'axios';
import { Server_path } from '../../utils/api-url';
import { Colors } from 'react-native/Libraries/NewAppScreen';


function TaskListModal({ isVisible, taskList, onClose, isPendingTasks }) {
    const { deleteTask, completeTask, userEmail, handleOnCancel, handleEdit, selectedTask, handleEditTask, isEditModalVisible } = useContext(MainContext);
    const [expandedItemId, setExpandedItemId] = useState(null); // Track expanded item
    // const [isEditModalVisible, setIsEditModalVisible] = useState(false); // State to manage the visibility of EditTaskModal
    // const [selectedTask, setSelectedTask] = useState(null); // State to hold the selected task for editing


    // const handleEditTask = async (userEmail, updatedTask) => {
    //     try {
    //         const response = await axios.put(`${Server_path}/api/tasks/editTask`, {
    //             userEmail,
    //             updatedTask
    //         });

    //         if (response.status === 200) {
    //             alert('Task updated successfully');
    //         } else {
    //             alert('Something went wrong with task updating');
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         alert('Something went wrong with task updating');
    //     }
    // };


    // const handleOnCancel = () => {
    //     setIsEditModalVisible(false)
    //     setSelectedTask('')
    // };

    // const handleEdit = (taskId) => {
    //     const taskToEdit = taskList.find((task) => task._id === taskId);
    //     setSelectedTask(taskToEdit); // Set the selected task for editing
    //     setIsEditModalVisible(true); // Show the EditTaskModal
    // };
    return (
        <Modal visible={isVisible} animationType="slide" onDismiss={onClose} transparent={true} onRequestClose={onClose}>
            <View style={styles.modalBackground}>
                <View style={styles.modalContent}>
                    <TouchableOpacity onPress={() => {
                        onClose()
                        Vibration.vibrate(25); // Trigger a short vibration
                    }} style={styles.closeButton}>

                        <Ionicons name="close-circle" size={24} color={COLORS.secondary} />
                    </TouchableOpacity>
                    <Text style={styles.header}>
                        {isPendingTasks ? '  Pending Tasks  ' : 'Completed Tasks'}
                    </Text>
                    <FlatList
                        data={taskList}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.taskItem,
                                    {
                                        borderColor:
                                            item.priority === 'high'
                                                ? COLORS.red
                                                : item.priority === 'medium'
                                                    ? 'orange'
                                                    : 'grey',
                                    },
                                ]}
                                onPress={() => setExpandedItemId(expandedItemId === item._id ? null : item._id)}
                            >
                                <View style={styles.taskDetails}>
                                    <Ionicons name="add-circle-outline" style={styles.addIcon} />
                                    <Text style={styles.taskTitle}>{item.title}
                                    </Text>
                                    {expandedItemId === item._id && (
                                        <View>
                                            {item.startDate && <Text style={styles.dateText}>{`Start Date: ${item.startDate}`}</Text>}
                                            {item.endDate && <Text style={styles.dateText}>{`End Date: ${item.endDate}`}</Text>}
                                            {item.description && <Text style={styles.description}>{item.description}</Text>}
                                            {item.startTime && <Text style={styles.dateText}>Start Time: {item.startTime}</Text>}
                                            {item.dueTime && <Text style={styles.dateText}>Due Time: {item.dueTime}</Text>}
                                        </View>
                                    )}
                                </View>
                                <View style={styles.taskFooter}>
                                    <Pressable onPress={() => {
                                        Vibration.vibrate(5)
                                        completeTask(item._id)
                                    }} style={styles.iconContainer}>
                                        <Ionicons name={item.completed ? 'ios-checkmark-circle' : 'ios-checkmark-circle-outline'} size={24} color={item.completed ? 'green' : COLORS.secondary} />
                                    </Pressable>
                                    <Pressable onPress={() => {
                                        Vibration.vibrate(5)
                                        deleteTask(item._id)
                                    }} style={styles.iconContainer}>
                                        <Ionicons name="trash" size={24} color={COLORS.secondary} />
                                    </Pressable>
                                    <Pressable onPress={() => handleEdit(item._id)} style={styles.iconContainer}>
                                        <Ionicons name="md-create" size={24} color={COLORS.secondary} />

                                    </Pressable>
                                </View>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item._id}
                        alwaysBounceVertical={false}
                    />
                </View>
                {selectedTask && (
                    <EditTaskModal
                        visible={isEditModalVisible}
                        task={selectedTask}
                        onSave={(editedTask) => {
                            handleEditTask(userEmail, editedTask);                            // Implement the onSave logic here
                        }}
                        onCancel={() => handleOnCancel()} // Hide the EditTaskModal
                    />
                )}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addIcon: {
        fontSize: 20,
        color: COLORS.primary
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 20,
        width: '80%',
        maxHeight: '80%',
    },
    closeButton: {
        alignSelf: 'flex-end',
        marginBottom: 10,
    },
    taskItem: {
        flexDirection: 'column',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: COLORS.black, // Set the border color
        borderStyle: 'dotted', // Use 'dotted' border style
        borderRadius: 8, // Adjust the value to control border roundness
        padding: 12, // Add padding around each task
    },
    taskDetails: {
        flex: 1,
    },
    taskTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: COLORS.black,
        alignSelf: 'center',
        marginBottom: 6,
    },
    description: {
        fontSize: 14,
        color: COLORS.grey,
    },
    dateText: {
        fontSize: 14,
        color: COLORS.black,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        color: COLORS.black,
        alignSelf: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    taskFooter: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
        borderTopColor: COLORS.secondary,
        borderWidth: .9,

    },
    iconContainer: {
        alignItems: 'center',
        borderWidth: .2,
    },
});

export default TaskListModal;