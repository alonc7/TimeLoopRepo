import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Pressable } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import COLORS from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { MainContext } from '../Context/MainContextProvider';

function TaskListModal({ isVisible, taskList, onClose, isPendingTasks }) {
    const { deleteTask, completeTask } = useContext(MainContext);

    const handleEdit = (taskId) => {
        // Implement edit functionality here
        console.log('Editing task with ID:', taskId);
    };

    return (
        <Portal>
            <Modal visible={isVisible} onDismiss={onClose} contentContainerStyle={styles.modalBackground}>
                <View style={styles.modalContent}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close-circle" size={24} color={COLORS.textLight} />
                    </TouchableOpacity>
                    <Text style={styles.header}>
                        {isPendingTasks ? '  Pending Tasks  ' : 'Completed Tasks'}
                    </Text>
                    <FlatList
                        data={taskList}
                        renderItem={({ item }) => (
                            <View style={styles.taskItem}>
                                <View style={styles.taskDetails}>
                                    <Text style={styles.taskTitle}>{item.title}</Text>
                                    <Text style={styles.dateText}>{`Start Date: ${item.startDate}`}</Text>
                                    <Text style={styles.dateText}>{`End Date: ${item.endDate}`}</Text>
                                </View>
                                <View style={styles.taskFooter}>
                                    <Pressable onPress={() => completeTask(item._id)} style={styles.iconContainer}>
                                        <Ionicons name={item.completed ? 'ios-checkmark-circle' : 'ios-checkmark-circle-outline'} size={24} color={item.completed ? COLORS.textSuccess : COLORS.textDark} />
                                    </Pressable>
                                    <Pressable onPress={() => deleteTask(item._id)} style={styles.iconContainer}>
                                        <Ionicons name="trash" size={24} color={COLORS.textDark} />
                                    </Pressable>
                                    <Pressable onPress={() => handleEdit(item._id)} style={styles.iconContainer}>
                                        <Ionicons name="md-create" size={24} color={COLORS.textDark} />
                                    </Pressable>
                                </View>
                            </View>
                        )}
                        keyExtractor={(item) => item._id}
                        alwaysBounceVertical={false}
                    />
                </View>
            </Modal>
        </Portal>
    );
}
export default TaskListModal;

const styles = StyleSheet.create({
    modalBackground: {
        backgroundColor: COLORS.white,
        borderRadius: 22,
        maxHeight: '70%', // Adjust the value here to control the modal's height
        elevation: 10,
        alignSelf: 'center', // Center the modal vertically,
        overflow: 'hidden'
    },
    modalContent: {
        padding: 30, // Adjust padding to provide more space around content
        borderWidth: 1,
        maxWidth: '100%',
    }, closeButton: {
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
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.black,
        alignSelf: 'center'

    },
    dateText: {
        fontSize: 14,
        color: COLORS.white,

    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        color: COLORS.black,
    },
    taskFooter: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,

    },
    iconContainer: {
        alignItems: 'center',

    },
});
