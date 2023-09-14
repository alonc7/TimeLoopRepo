import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, Pressable, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import COLORS from '../../constants/colors';
function RepeatTaskModal(props) {
    const { repeatOption, selectedDays, repeatSelectedTime, updateRepeatOption, updateSelectedDays, updateRepeatSelectedTime } = props;
    const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
    const DAYS_SELECT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const handleRepeatOptionChange = (option) => {
        updateRepeatOption(option);
        setIsTimePickerVisible(false);
    };

    const handleDaySelection = (day) => {
        const updatedDays = selectedDays.includes(day)
            ? selectedDays.filter((selectedDay) => selectedDay !== day)
            : [...selectedDays, day];
        updateSelectedDays(updatedDays);
    };

    const handleTimeChange = (event, selectedDate) => {
        let formattedTime = formatTimeTo24Hour(selectedDate?.toLocaleTimeString());
        if (event.type === 'set') {
            updateRepeatSelectedTime(formattedTime);
            setIsTimePickerVisible(false);
        }
    };

    const formatTimeTo24Hour = (time) => {
        return moment(time, 'h:mm:ss A').format('HH:mm:ss');
    };

    const handleSave = () => {
        props.onSave({
            repeatOption,
            selectedDays,
            repeatSelectedTime,
        });
    };

    return (
        <Modal visible={props.visible} animationType="slide" transparent={true}>
            <View style={styles.modalBackground}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalHeader}>Repeat Task</Text>

                    <View style={styles.dropdownContainer}>
                        <Picker
                            selectedValue={repeatOption}
                            onValueChange={(itemValue) => handleRepeatOptionChange(itemValue)}
                        >
                            <Picker.Item label="none" value="none" />
                            <Picker.Item label="Daily" value="daily" />
                            <Picker.Item label="Custom" value="custom" />
                        </Picker>
                    </View>

                    {repeatOption === 'custom' && (
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
                        <DateTimePicker
                            value={repeatSelectedTime ? new Date(repeatSelectedTime) : new Date()}
                            mode="time"
                            onChange={handleTimeChange}
                        />
                    )}

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
        borderRadius: 12,
        padding: 20,
        width: '80%',
        maxHeight: '80%',
    },
    modalHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    dropdownContainer: {
        borderWidth: 1,
        borderColor: COLORS.secondary,
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    saveButton: {
        backgroundColor: COLORS.primary,
        padding: 10,
        borderRadius: 5,
        flex: 1,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: COLORS.secondary,
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
});

export default RepeatTaskModal;
