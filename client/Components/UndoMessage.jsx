import React, { useState, useEffect, useContext,useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MainContext } from './Context/MainContextProvider'; // Make sure to import from the correct path
import COLORS from '../constants/colors';

export default function UndoMessage() {
    const {
        showUndoMessage,
        undoAction,
        undoTaskData,
        undoDelete,
        undoComplete
    } = useContext(MainContext);

    const [isVisible, setIsVisible] = useState(false);
    const [num, setNum] = useState(1);

    useEffect(() => {
        
        if (showUndoMessage && undoTaskData) {
            setIsVisible(true);

            const timeoutId = setTimeout(() => {
                setIsVisible(false);
                // Automatically remove the message after a certain duration
                // Also, the function should be called with the task data (undoTaskData)
                if (showUndoMessage === 'delete') {
                    undoDelete(undoTaskData);
                } else if (showUndoMessage === 'complete') {
                    undoComplete(undoTaskData);
                }
            }, 2000); // 2 seconds

            return () => {
                clearTimeout(timeoutId); // Clear the timeout when the component unmounts
            };
        }
    }, [showUndoMessage, undoTaskData, undoDelete, undoComplete]);

    if (isVisible) {
        return (
            <View style={styles.banner}>
                <Text style={styles.bannerText}>
                    {`Task ${undoAction === 'delete' ? 'removed successfully' : 'completed successfully'}`}
                </Text>
                <TouchableOpacity onPress={() => {
                    if (undoAction === 'delete') {
                        undoDelete(undoTaskData); // Call the appropriate function with the task data
                    } else if (undoAction === 'complete') {
                        undoComplete(undoTaskData); // Call the appropriate function with the task data
                    }
                }}>
                    <Text style={styles.undoButtonText}>
                        {`Undo ${undoAction === 'delete' ? 'remove' : 'complete'}`}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return null;
}
const styles = StyleSheet.create({
    banner: {
        position: 'absolute',
        bottom: 5,
        left: 0,
        right: 0,
        backgroundColor: COLORS.grey,
        paddingVertical: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    bannerText: {
        color: COLORS.white,
        fontWeight: 'bold',
    },
    undoButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        backgroundColor: COLORS.primary,
    },
    undoButtonText: {
        color: COLORS.red,
        fontWeight: 'bold',
        padding: 20,
        margin: -9,
    },
});
