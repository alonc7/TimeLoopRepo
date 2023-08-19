import React, { useContext, useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import COLORS from '../../constants/colors';
import { MainContext } from '../Context/MainContextProvider';
import CountdownTimer from '../CountdownTimer';

function CountdownModal({ isVisible, onClose }) {
    const { pendingTaskList } = useContext(MainContext);
    const [remainingTimes, setRemainingTimes] = useState({});
    const [expandedItemId, setExpandedItemId] = useState(null);

    useEffect(() => {

        const calculateRemainingTime = () => {
            const newRemainingTimes = {};
            pendingTaskList.forEach(task => {
                if (task.startDate && task.dueDate && task.startTime && task.dueTime) {
                    const now = new Date();
                    const endTime = new Date(task.dueDate?.replace(/\//g, '-') + ' ' + task.dueTime);
                    if (endTime > now) {
                        const timeRemaining = Math.max(0, endTime - now);
                        newRemainingTimes[task._id] = formatTime(timeRemaining);
                        console.log('\n' + "endTime",
                            endTime + '\n',
                            "task's due date", task.dueTime + '\n',
                            "task's end time", endTime + task.dueDate + '\n',
                            "time remaining in miliseconds.", timeRemaining + '\n');
                    }

                }
            });
            setRemainingTimes(newRemainingTimes);
        };
        calculateRemainingTime();
    }, [pendingTaskList]);


    // Function to convert milliseconds into hours, minutes, and seconds
    const formatTime = (milliseconds) => {
        const seconds = Math.floor(Math.round((milliseconds / 1000)) % 60);
        const minutes = Math.floor(Math.round((milliseconds / 1000 / 60)) % 60);
        const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24))
        const hours = Math.floor(Math.round(milliseconds / 3600000) % 24);
        console.log(milliseconds, days, hours, minutes, seconds);

        return { days, hours, minutes, seconds };
    };
    const expiredTasks = pendingTaskList.filter(task => !remainingTimes[task._id])
    const tasksToRender = pendingTaskList.filter(task => remainingTimes[task._id]);
    // Calculate remaining time using pendingTaskList


    return (
        <Modal visible={isVisible} animationType="slide" transparent={true}>
            <View style={styles.modalBackground}>
                <View style={styles.modalContent}>
                    {/*flat list for pending tasks*/}
                    <FlatList
                        data={tasksToRender}
                        renderItem={({ item }) => {
                            return (
                                <View style={styles.taskItem}>
                                    <Text style={styles.taskTitle}>{item.title}</Text>
                                    <CountdownTimer remainingTime={{ ...remainingTimes[item._id] }} />
                                    {/* /*if task time is due then show nothing */}
                                </View>
                            );
                        }}
                        keyExtractor={(item) => item._id}
                    />
                    <View style={styles.separator} />

                    <FlatList
                        data={expiredTasks}
                        renderItem={({ item }) => {
                            return (
                                <View style={styles.taskItem}>
                                    <Text style={styles.taskTitle}>{item.title}</Text>
                                    {remainingTimes[item._id] ? (
                                        <CountdownTimer remainingTime={remainingTimes[item._id]} />
                                    ) : (
                                        <Text>Task has expired</Text>
                                    )}
                                </View>
                            );
                        }}
                        keyExtractor={(item) => item._id}
                    />
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
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
    modalContent: {
        backgroundColor: COLORS.white,
        borderRadius: 22,
        padding: 20,
        width: '80%',
        alignItems: 'center',
    },
    remainingTimeText: {
        fontSize: 18,
        marginBottom: 15,
    },
    closeButton: {
        marginTop: 10,
    },
    closeButtonText: {
        color: COLORS.primary,
        fontSize: 16,
    },
    taskItem: {
        flexDirection: 'row', // Display title and countdown timer in the same row
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    taskTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    separator: {
        height: 1,
        width: '70%',
        backgroundColor: COLORS.primary, // Adjust color as needed
        margin: 5,
    },

});

export default CountdownModal;
