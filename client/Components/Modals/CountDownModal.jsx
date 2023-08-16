import React, { useContext, useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import COLORS from '../../constants/colors';
import { MainContext } from '../Context/MainContextProvider';
import CountdownTimer from '../CountdownTimer';

function CountdownModal({ isVisible, onClose }) {
    const { pendingTaskList } = useContext(MainContext);
    const [remainingTimes, setRemainingTimes] = useState({});

    // Function to convert milliseconds into hours, minutes, and seconds
    const formatTime = (milliseconds) => {
        const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24))
        const seconds = Math.floor((milliseconds / 1000) % 60);
        const minutes = Math.floor((milliseconds / 1000 / 60) % 60);
        const hours = Math.floor(milliseconds / (1000 / 60 / 60) % 24);

        return { days, hours, minutes, seconds };
    };

    // Calculate remaining time using pendingTaskList
    useEffect(() => {
        const calculateRemainingTime = () => {
            const remainingTimes = {};

            pendingTaskList.forEach(task => {
                const now = new Date();
                const endTime = new Date(task.dueDate.replace(/\//g, '-')); // regular expression to replace all slashes with dash.
                // console.log("countDownModal endTime->", endTime);

                if (endTime > now) {
                    const timeRemaining = Math.max(0, endTime - now);
                    remainingTimes[task._id] = formatTime(timeRemaining);
                }
            });
            setRemainingTimes(remainingTimes);
        };

        calculateRemainingTime();
    }, [pendingTaskList]);

    return (
        <Modal visible={isVisible} animationType="slide" transparent={true}>
            <View style={styles.modalBackground}>
                <View style={styles.modalContent}>
                    <FlatList
                        data={pendingTaskList}
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
        backgroundColor: 'white',
        borderRadius: 10,
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
});

export default CountdownModal;
