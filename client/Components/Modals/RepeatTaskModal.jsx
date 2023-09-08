import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'; // Import moment.js library

function RepeatTaskModal(props) {
    // State variables
    const { repeatOption, selectedDays, repeatSelectedTime, updateRepeatOption, updateSelectedDays, updateRepeatSelectedTime } = props;
    const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
    const DAYS_SELECT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    // Handle changing the repeat option
    const handleRepeatOptionChange = (option) => {
        updateRepeatOption(option);
        // Reset visibility and values when changing repeat option
        setIsTimePickerVisible(false);
    };

    // Handle day selection
    const handleDaySelection = (day) => {
        const updatedDays = selectedDays.includes(day)
            ? selectedDays.filter((selectedDay) => selectedDay !== day)
            : [...selectedDays, day];
        updateSelectedDays(updatedDays);
    };

    // Handle changing the time
    const handleTimeChange = (event, selectedDate) => {
        let formattedTime = formatTimeTo24Hour(selectedDate?.toLocaleTimeString());
        if (event.type === 'set') {
            updateRepeatSelectedTime(formattedTime);
            setIsTimePickerVisible(false); // Close the time picker on 'OK'
        }
    };

    // Function to format time to 24-hour format
    const formatTimeTo24Hour = (time) => {
        // Assuming the input time is in "h:mm:ss A" format
        return moment(time, 'h:mm:ss A').format('HH:mm:ss');
    };

    // Handle saving the selected options
    const handleSave = () => {
        // const formattedTime = formatTimeTo24Hour(repeatSelectedTime?.toLocaleTimeString());

        // Pass the selected options to the parent component
        props.onSave({
            repeatOption,
            selectedDays,
            repeatSelectedTime,

        });
    };


    return (
        <Modal visible={props.visible} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalHeader}>Repeat Task</Text>

                    {/* Repeat Options Dropdown */}
                    <View style={styles.dropdownContainer}>
                        <Picker
                            selectedValue={repeatOption}
                            onValueChange={(itemValue) => handleRepeatOptionChange(itemValue)}
                        >
                            <Picker.Item label="none" value="none" />
                            <Picker.Item label="Daily" value="daily" />
                            <Picker.Item label="Custome" value="custome" />
                        </Picker>
                    </View>

                    {/* Day Selection */}
                    {repeatOption === 'custome' && (

                        <View style={styles.daySelectionContainer}>
                            {DAYS_SELECT.map((day, index) => (
                                <Pressable
                                    key={index}
                                    style={[
                                        styles.dayButton,
                                        selectedDays.includes(index) && styles.selectedDayButton,
                                    ]}
                                    onPress={() => handleDaySelection(index)}
                                >
                                    <Text style={styles.dayText}>{day}</Text>
                                </Pressable>
                            ))}
                        </View>
                    )}

                    {/* Time Picker */}
                    <Text
                        onPress={() => setIsTimePickerVisible(true)}
                        style={styles.timeLabel}
                    >
                        Select Time:
                    </Text>
                    {repeatSelectedTime && (
                        <TextInput
                            value={repeatSelectedTime}
                            style={{ fontWeight: 'bold' }}
                            editable={false}
                        />
                    )}
                    {isTimePickerVisible && (
                        console.log(repeatSelectedTime),
                        <DateTimePicker
                            value={repeatSelectedTime ? (new Date(repeatSelectedTime)) : new Date()}
                            mode="time"
                            onChange={handleTimeChange}
                        />
                    )}


                    {/* Save and Cancel Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={props.onClose} style={styles.cancelButton}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal >
    );
}

export default RepeatTaskModal;

const styles = {
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    dropdownContainer: {
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,
    },
    daySelectionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    dayButton: {
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 50,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',

    },
    selectedDayButton: {
        backgroundColor: 'lightblue',
    },
    dayText: {
        fontSize: 18,
    },
    timeLabel: {
        marginTop: 10,
        fontSize: 16,
    },
    endsLabel: {
        marginTop: 10,
        fontSize: 16,
    },
    endOptionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    endOptionButton: {
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,
        padding: 5,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedEndOption: {
        backgroundColor: 'lightblue',
    },
    endDateLabel: {
        marginTop: 10,
        fontSize: 16,
    },
    occurrencesLabel: {
        marginTop: 10,
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    saveButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: 'gray',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        alignItems: 'center',
        marginLeft: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
};
