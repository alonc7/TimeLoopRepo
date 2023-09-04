import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'; // Import moment.js library

function RepeatTaskModal(props) {
    // State variables
    const [repeatOption, setRepeatOption] = useState('none');
    const [selectedDays, setSelectedDays] = useState([]);
    const [selectedTime, setSelectedTime] = useState(new Date());
    // const [startOption, setStartOption] = useState(new Date());
    // const [endOption, setEndOption] = useState('never');
    // const [endDate, setEndDate] = useState(new Date());
    // const [occurrences, setOccurrences] = useState(1);
    const [selectedOnEndDate, setSelectedOnEndDate] = useState(new Date()); // Initialize with a default date
    // const [selectedOnStartDate, setSelectedOnStartDate] = useState(new Date()); // Initialize with a default date
    const [startDate, setStartDate] = useState(new Date())
    // State variables for visibility control
    const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
    const [isEndDateVisible, setIsEndDateVisible] = useState(false);
    // const [isOccurrencesVisible, setIsOccurrencesVisible] = useState(false);
    // const [isStartDateVisible, setIsStartDateVisible] = useState(false);

    const DAYS_SELECT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    // Handle changing the repeat option
    const handleRepeatOptionChange = (option) => {
        setRepeatOption(option);

        // Reset visibility and values when changing repeat option
        setIsTimePickerVisible(false);
        setIsEndDateVisible(false);
        // setIsOccurrencesVisible(false);

        // Additional logic based on the selected option
        if (option === 'daily') {
            // Implement any specific logic for the 'daily' option here
        }
    };

    // Handle day selection
    const handleDaySelection = (day) => {
        const updatedDays = selectedDays.includes(day)
            ? selectedDays.filter((selectedDay) => selectedDay !== day)
            : [...selectedDays, day];
        setSelectedDays(updatedDays);
    };

    // Handle changing the time
    const handleTimeChange = (event, selectedDate) => {
        if (event.type === 'set') {
            setSelectedTime(selectedDate);
            setIsTimePickerVisible(false); // Close the time picker on 'OK'
        }
    };

    // Handle changing the end option
    // const handleEndOptionChange = (option) => {
    //     setEndOption(option);

    //     // Reset visibility and values when changing end option
    //     setIsEndDateVisible(false);
    //     setIsOccurrencesVisible(false);

    //     if (option === 'on') {
    //         // Show the date picker for "On"
    //         setIsEndDateVisible(true);
    //     } else if (option === 'occurrences') {
    //         setIsOccurrencesVisible(true); // Show the occurrences picker
    //     } else {
    //         setSelectedOnEndDate(new Date()); // Reset the selected "On" date for other options
    //     }
    // };


    // Handle changing the end date
    // const handleEndDateChange = (event, selectedDate) => {
    //     if (event.type === 'set') {
    //         setEndDate(selectedDate);
    //         setIsEndDateVisible(false); // Close the end date picker on 'OK'
    //     }
    // };
    // Handle changing the start date
    // const handleStartDateChange = (event, selectedDate) => {
    //     if (event.type === 'set') {
    //         setStartDate(selectedDate);
    //         setIsStartDateVisible(false); // Close the end date picker on 'OK'
    //     }
    // };

    // Handle changing the number of occurrences
    // const handleOccurrencesChange = (value) => {
    //     setOccurrences(value);
    //     setIsOccurrencesVisible(false); // Close the occurrences picker on 'OK'
    // };
    // Function to format time to 24-hour format
    const formatTimeTo24Hour = (time) => {
        // Assuming the input time is in "h:mm:ss A" format
        return moment(time, 'h:mm:ss A').format('HH:mm:ss');
    };
    // Handle saving the selected options
    const handleSave = () => {
        // Format the selectedTime to 24-hour format before sending
        const formattedTime = formatTimeTo24Hour(selectedTime.toLocaleTimeString());
        // Pass the selected options to the parent component
        props.onSave({
            repeatOption,
            selectedDays,
            selectedTime: formattedTime, // Use the formatted time
            // startOption, // Include start option
            // startDate, // Include start date
            // endOption,
            // endDate,
            // occurrences,
        });
    };

    //Handle changing the start option
    // const handleStartOptionChange = (option) => {
    //     setStartOption(option);
    //     setIsStartDateVisible(option === 'on'); // Show the date picker when the option is set to 'on'
    // };

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
                    {repeatOption === 'Custome' && (

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

                    {/*Starts */}
                    {/* <Text style={styles.startsLabel}>Starts:</Text>
                    <View style={styles.endOptionsContainer}>
                        <TouchableOpacity
                            style={[
                                styles.endOptionButton,
                                startOption === 'now' && styles.selectedEndOption,
                            ]}
                            onPress={() => handleStartOptionChange('now')}
                        >
                            <Text>Now</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.endOptionButton,
                                startOption === 'on' && styles.selectedEndOption,
                            ]}
                            onPress={() => handleStartOptionChange('on')}
                        >
                            <Text>On</Text>
                        </TouchableOpacity>
                    </View> */}

                    {/* Start Date */}
                    {/* {startOption === 'on' && (
                        <>
                            <Text style={styles.endDateLabel}>Select Start Date:</Text>
                            <Pressable onPress={() => setIsStartDateVisible(true)}>
                                <TextInput
                                    value={selectedOnStartDate.toDateString()}
                                    style={{ fontWeight: 'bold' }}
                                    editable={false}
                                />
                            </Pressable>
                            {isStartDateVisible && (
                                <DateTimePicker
                                    value={selectedOnStartDate}
                                    mode="date"
                                    onChange={(event, selectedDate) => {
                                        setIsStartDateVisible(false);
                                        setSelectedOnEndDate(selectedDate || selectedOnEndDate);
                                        handleStartDateChange(event, selectedDate);
                                    }}
                                />
                            )}
                        </>
                    )} */}


                    {/* Time Picker */}
                    <Text
                        onPress={() => setIsTimePickerVisible(true)}
                        style={styles.timeLabel}
                    >
                        Select Time:
                    </Text>
                    <TextInput
                        value={selectedTime.toLocaleTimeString()}
                        style={{ fontWeight: 'bold' }}
                        editable={false}
                    />
                    {isTimePickerVisible && (
                        <DateTimePicker
                            value={selectedTime}
                            mode="time"
                            onChange={handleTimeChange}
                        />
                    )}

                    {/* Ends */}
                    {/* <Text style={styles.endsLabel}>Ends:</Text>
                    <View style={styles.endOptionsContainer}>
                        <TouchableOpacity
                            style={[
                                styles.endOptionButton,
                                endOption === 'never' && styles.selectedEndOption,
                            ]}
                            onPress={() => handleEndOptionChange('never')}
                        >
                            <Text>Never</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.endOptionButton,
                                endOption === 'on' && styles.selectedEndOption,
                            ]}
                            onPress={() => handleEndOptionChange('on')}
                        >
                            <Text>On</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.endOptionButton,
                                endOption === 'occurrences' && styles.selectedEndOption,
                            ]}
                            onPress={() => handleEndOptionChange('occurrences')}
                        >
                            <Text>After</Text>
                        </TouchableOpacity>
                    </View> */}

                    {/* End Date */}
                    {/* {isEndDateVisible && (
                        <>
                            <Text style={styles.endDateLabel}>Select End Date:</Text>
                            {endOption === 'on' && (
                                <>
                                    <DateTimePicker
                                        value={selectedOnEndDate}
                                        mode="date"
                                        onChange={(event, selectedDate) => {
                                            setIsEndDateVisible(false);
                                            setSelectedOnEndDate(selectedDate || selectedOnEndDate);
                                            handleEndDateChange(event, selectedDate)
                                        }}
                                    />
                                </>
                            )}

                        </>
                    )} */}

                    {/* <TextInput
                        value={selectedOnEndDate.toDateString()}
                        style={{ fontWeight: 'bold' }}
                        editable={false}
                    /> */}

                    {/* Occurrences */}
                    {/* {} */}
                    {/* // isOccurrencesVisible &&  */}
                    {/* // ( */}
                    {/* //     <> */}
                    {/* //         <Text style={styles.occurrencesLabel}>Number of Occurrences:</Text> */}
                    {/* //         <TextInput */}
                    {/* //             value={String(occurrences)} */}
                    {/* //             editable={false} */}
                    {/* //         /> */}
                    {/* //         Implement custom input or picker for occurrences */}
                    {/* //         <Picker */}
                    {/* //             selectedValue={occurrences} */}
                    {/* //             onValueChange={(itemValue) => handleOccurrencesChange(itemValue)} */}
                    {/* //         > */}
                    {/* //             {Array.from({ length: 10 }, (_, i) => ( */}
                    {/* //                 <Picker.Item key={i} label={String(i + 1)} value={i + 1} /> */}
                    {/* //             ))} */}
                    {/* //         </Picker> */}
                    {/* //     </> */}
                    {/* // )} */}
                    {/* {endOption === 'on' && (
                        <TextInput
                            value={selectedTime.toLocaleTimeString()}
                            style={{ fontWeight: 'bold' }}
                            editable={false}
                        />
                    )} */}
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
