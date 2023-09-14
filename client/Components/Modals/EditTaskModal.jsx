import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';
import DropDownPicker from 'react-native-dropdown-picker';

function EditTaskModal(props) {
    const { task } = props;
    const [editedTitle, setEditedTitle] = useState(task?.title);
    const [editedDescription, setEditedDescription] = useState(task?.description);
    const [editedStartDate, setEditedStartDate] = useState(task?.startDate);
    const [editedDueDate, setEditedDueDate] = useState(task?.dueDate);
    const [editedStartTime, setEditedStartTime] = useState(task?.startTime);
    const [editedDueTime, setEditedDueTime] = useState(task?.dueTime);
    const [selectedPriority, setSelectedPriority] = useState(task?.priority); // State for selected priority
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);

    const priorityOptions = [
        { label: 'High', value: 'high' },
        { label: 'Medium', value: 'medium' },
        { label: 'Low', value: 'low' },
    ];


    const handleSave = () => {

        const datePatern = /^\d{4}\/\d{2}\/\d{2}$/;
        if (!datePatern.test(editedStartDate) || !datePatern.test(editedDueDate)) {
            alert('Invalid dates inserted. [YYYY/MM/DD]');
            return;
        }

        const timePatern = /^\d{2}:\d{2}$/;

        if (!timePatern.test(editedStartTime) || !timePatern.test(editedDueTime)) {
            alert('Invalid time inserted. [HH:MM]')
            return;
        }
        const editedTask = {
            ...props.task,
            title: editedTitle,
            description: editedDescription,
            startTime: editedStartTime,
            dueTime: editedDueTime,
            startDate: editedStartDate,
            dueDate: editedDueDate,
            priority: selectedPriority,
        };
        props.onSave(editedTask);
    };

    const handleInputChange = (inputValue, inputField) => {
        // Define a regular expression pattern to match allowed characters
        const allowedPattern = /[^0-9\/:-]/g;

        // Remove any characters that are not allowed
        const sanitizedInput = inputValue.replace(allowedPattern, '');

        // Update the state based on the input field
        switch (inputField) {
            case 'startDate':
                setEditedStartDate(sanitizedInput);
                break;
            case 'dueDate':
                setEditedDueDate(sanitizedInput);
                break;
            case 'startTime':
                setEditedStartTime(sanitizedInput);
                break;
            case 'dueTime':
                setEditedDueTime(sanitizedInput);
                break;
            // Add more cases as needed for other input fields
            default:
                break;
        }
    };

    return (
        <Modal visible={props.visible} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={setEditedTitle}
                        value={editedTitle}
                        placeholder="Edit task's title"
                    />
                    <TextInput
                        style={styles.textInput}
                        onChangeText={setEditedDescription}
                        value={editedDescription}
                        placeholder="Edit task's description"
                    />
                    <TextInput
                        style={styles.textInput}
                        onChangeText={(value) => handleInputChange(value, 'startDate')}
                        value={editedStartDate}
                        placeholder="Start Date: YYYY/MM/DD"
                    />
                    <TextInput
                        style={styles.textInput}
                        onChangeText={(value) => handleInputChange(value, 'startTime')}
                        value={editedStartTime}
                        placeholder="Start Time: HH:MM"
                    />
                    <TextInput
                        style={styles.textInput}
                        onChangeText={(value) => handleInputChange(value, 'dueDate')}
                        value={editedDueDate}
                        placeholder="Due Date: YYYY/MM/DD"
                    />
                    <TextInput
                        style={styles.textInput}
                        onChangeText={(value) => handleInputChange(value, 'dueTime')}
                        value={editedDueTime}
                        placeholder="Due Time: HH:MM"
                    />


                    <DropDownPicker
                        open={isDropDownOpen}
                        value={selectedPriority}
                        items={priorityOptions}
                        setOpen={setIsDropDownOpen}
                        setValue={setSelectedPriority}
                        placeholder="Set Priority"
                        containerStyle={styles.dropdownContainer}
                        style={styles.dropdown}
                        dropDownStyle={styles.dropdownMenu}
                    />



                    <Button title="Save" onPress={handleSave} />
                    <Button title="Cancel" onPress={props.onCancel} />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderRadius: 10,
        padding: 20,
        width: '80%',
    },
    textInput: {
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: 10,
        padding: 10,
        marginVertical: 8,
    },
    dropdownContainer: {
        height: 50,
        marginVertical: 8,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    dropdownItem: {
        justifyContent: 'flex-start',
    },
    dropdownMenu: {
        marginTop: 8,
        borderRadius: 8,
    },
});

export default EditTaskModal;
