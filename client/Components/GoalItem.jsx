import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, Button, SafeAreaView } from 'react-native';
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
        <SafeAreaView style={styles.container}>
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
                            <Text>{endDate}</Text>
                        </View>
                        <View style={styles.timeContainer}>
                            <Text>{startHour}</Text>
                            <Text>{endHour}</Text>

                        </View>
                        <View style={styles.timeContainer}>
                        </View>
                    </View>

                <View style={styles.buttonContainer}>
                <Pressable onPress={handleDeleteItem}><Text style={styles.x}>✖️</Text></Pressable>

                </View>
                </View>
            </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        width:'99.9%'
    },
    goalItem: {
        flex: 1,
        // flexDirection: 'row',
        // alignItems: 'center',
        justifyContent: 'center',
        marginTop: 31,
        marginVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 30,
        backgroundColor: '#5b55ab4b',
    },
    leftColumn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightColumn: {
        flex: 1,
        marginRight: 5,
    },
    checkboxIcon: {
        marginRight: 8,
        color: COLORS.primary
    },
    taskText: {
        flex: 1,
        color: 'white',
        paddingLeft: 10,
        marginBottom:30
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginBottom: 8,
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonContainer: {
        width: 30, // Customize the width as needed
        height: 50, // Customize the height as needed
    },
    x:{
        borderWidth:1,
        borderStyle:'dotted',
        shadowColor:'#f0f',
        shadowRadius:30
    }
});

export default GoalItem;
