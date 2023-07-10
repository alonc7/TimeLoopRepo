import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
function GoalItem(props) {
    const { text, startDate, endDate, startHour, endHour, onDeleteItem, id } = props;
    const [completed, setCompleted] = useState(false);

    function handleDeleteItem() {
        onDeleteItem(props.id);
    }

    function toggleCompletion() {
        setCompleted(!completed);
    }

    return (
        <Pressable onPress={toggleCompletion}>
            <View style={styles.goalItem}>
                <View style={styles.leftColumn}>
                    <Ionicons
                        name={completed ? 'ios-checkmark-circle' : 'ios-checkmark-circle-outline'}
                        size={24}
                        color={completed ? '#2ecc71' : '#ffffff'}
                        onPress={toggleCompletion}
                    />
                    <Text style={styles.taskText}>{text}</Text>
                </View>
                <View style={styles.rightColumn}>
                    <View style={styles.dateContainer}>
                        <Text>{startDate}</Text>
                        <Text>~{endDate}</Text>
                    </View>
                    <View style={styles.timeContainer}>
                        <Text>Start Hour:</Text>
                        <Text>{startHour}</Text>
                    </View>
                    <View style={styles.timeContainer}>
                        <Text>End Hour:</Text>
                        <Text>{endHour}</Text>
                    </View>
                </View>

            </View>
                <View style={styles.buttonContainer}>
                    <Button onPress={handleDeleteItem} title="✖️" />
                </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    goalItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 35,
        marginVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        backgroundColor: '#5b55ab',
    },
    leftColumn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightColumn: {
        flex: 1,
        marginLeft: 4,
    },
    checkboxIcon: {
        marginRight: 8,
        color: COLORS.primary
    },
    taskText: {
        flex: 1,
        color: 'white',
        paddingLeft: 10
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonContainer: {
        width: 30, // Customize the width as needed
        height: 50, // Customize the height as needed
      },
});

export default GoalItem;