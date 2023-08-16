import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, TextInput, Modal, Image, TouchableOpacity, Alert, KeyboardAvoidingView, Pressable, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import DatePicker from 'react-native-modern-datepicker';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';

function TaskInput(props) {
  const [enteredTaskText, setEnteredTaskText] = useState('');
  const [enteredDescription, setEnteredDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState();
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [dueTime, setDueTime] = useState(null);
  const [isStartDateSelected, setisStartDateSelected] = useState(false);
  const [isTitle, setisTitle] = useState(false);
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState('low');
  const [isPriorityVisible, setPriorityVisible] = useState(false);
  // const [isInfoVisible, setInfoVisible] = useState(true); // New state for the info message

  const taskInputHandler = (enteredText) => {
    setEnteredTaskText(enteredText);
    if (enteredText.trim !== '')
      setisTitle(true);
  };

  const descriptionInputHandler = (text) => {
    setEnteredDescription(text);
  };
  const addTaskHandler = () => {
    if (!enteredTaskText || !selectedDate) {
      return;
    }

    if (!isStartDateSelected) {
      setStartDate(selectedDate);
      setStartTime(selectedTime);
      setisStartDateSelected(true);
    } else {
      console.log('gets here ');
      setDueDate(selectedDate);
      setDueTime(selectedTime);
      props.onAddTask(enteredTaskText, enteredDescription, startDate, selectedDate, startTime, selectedTime, selectedPriority);
      setEnteredTaskText('');
      setEnteredDescription('')
      setSelectedDate(null);
      setisStartDateSelected(false);

      props.toggleBtn();
    }
  };
  const addQuickTaskHandler = () => {
    if (!enteredTaskText) {
      return;
    }
    console.log("addQuickTaskHandler", enteredDescription);
    props.onAddTask(enteredTaskText, enteredDescription, startDate, selectedDate, startTime, selectedTime, selectedPriority);

    setEnteredTaskText('');
    setEnteredDescription('');
    setSelectedDate(null);
    setSelectedTime(null);
    setStartDate('');
    setStartTime('');
    setDueDate(null);
    setDueTime(null);
    setisStartDateSelected(false);
    setSelectedPriority('low');
    setPriorityVisible(false);
    setCalendarVisible(false);
    setisTitle(false);

    props.toggleBtn(); // Close the modal if needed
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time.toString());
  };

  const handleClose = () => {
    props.onClose();
  };

  const handleToggleCalendar = () => {
    if (isPriorityVisible) {
      setPriorityVisible(!isPriorityVisible);
    }
    setCalendarVisible(!isCalendarVisible);
  };
  const handleTogglePriority = () => {
    if (isCalendarVisible) {
      setCalendarVisible(!isCalendarVisible);
    }
    setPriorityVisible(!isPriorityVisible);
  };

  const handlePrioritySelection = (priority) => {
    setSelectedPriority(priority);
    setPriorityVisible(false);
  };

  const priorityOptions = (
    <View style={styles.priorityOptionsContainer}>
      <Text style={styles.instructionText}>Set priority of task</Text>
      <TouchableOpacity
        style={[
          styles.priorityOption,
          styles.highPriorityOption,
          selectedPriority === 'high' && styles.priorityOption,
        ]}
        onPress={() => handlePrioritySelection('high')}
      >
        <Text
          style={[
            styles.priorityOptionText,
            selectedPriority === 'high' && styles.selectedPriorityOptionText,
          ]}
        >
          High
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.priorityOption,
          styles.mediumPriorityOption,
          selectedPriority === 'medium' && styles.selectedPriority,
        ]}
        onPress={() => handlePrioritySelection('medium')}
      >
        <Text
          style={[
            styles.priorityOptionText,
            selectedPriority === 'medium' && styles.selectedPriorityOptionText,
          ]}
        >
          Medium
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.priorityOption,
          styles.lowPriorityOption,
          selectedPriority === 'low' && styles.selectedPriority,
        ]}
        onPress={() => handlePrioritySelection('low')}
      >
        <Text
          style={[
            styles.priorityOptionText,
            selectedPriority === 'low' && styles.selectedPriorityOptionText,
          ]}
        >
          Low
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal visible={props.visible} animationType="slide" transparent={true}>

      <KeyboardAvoidingView
        style={{ flex: 1 }} // Ensure the view takes up the full screen
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust behavior based on platform
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0} // Adjust offset as needed
      >

        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Close Button */}

            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={19} color={COLORS.black} />
            </TouchableOpacity>

            <TextInput
              placeholderTextColor={COLORS.grey}
              style={styles.textInput}
              placeholder="Insert task's title"
              onChangeText={taskInputHandler}
              value={enteredTaskText}
            />

            {/* Description Input */}
            <TextInput
              placeholderTextColor={COLORS.grey}
              style={styles.textInput}
              placeholder="Insert task's description"
              onChangeText={descriptionInputHandler}
              value={enteredDescription}
              maxLength={400} // Limit to 200 characters
            />

            {/* Char Count */}
            <Text style={styles.charCount}>
              {enteredDescription.length}/400 characters
            </Text>



            <View style={styles.iconContainer}>
              <TouchableOpacity style={styles.iconButton} onPress={handleToggleCalendar}>
                <Ionicons name="calendar" size={40} style={[{ color: COLORS.primary, }]} />
                <View style={styles.iconLabelContainer}>
                  <Text style={styles.iconLabel}>Date&Time</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={handleTogglePriority}>
                <Ionicons name="md-options" size={40} color={COLORS.primary} />
                <Text style={styles.iconLabel}>Priority</Text>
                <View style={styles.iconLabelContainer}>

                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.centeredButtonContainer}>
              {isTitle && (
                <Pressable onPress={addQuickTaskHandler} style={styles.iconButton}>
                  <Ionicons name='paper-plane' size={40} color={COLORS.primary} />
                  <View style={styles.iconLabelContainer}>
                    <Text style={styles.iconLabel}>Quick Task</Text>
                  </View>
                </Pressable>
              )}
              {!isTitle && (
                <View style={styles.emptyTaskMessage}>
                  <Text style={styles.emptyTaskText}>
                    Add title and description for quick task,{'\n'} Priority and date are optional.
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.centeredButtonContainer}>
              {isStartDateSelected && (
                <Button
                  style={{ color: 'red' }}
                  mode="elevated"
                  onPress={() => setisStartDateSelected(false)}
                >
                  Clear
                </Button>
              )}
              <Button
                style={styles.button}
                mode="elevated"
                onPress={addTaskHandler}
                disabled={!enteredTaskText || !selectedDate}
              >
                {isStartDateSelected ? 'Set Due Date' : 'Set Start Date'}
              </Button>
              {/* <Button style={styles.button} mode="outlined" onPress={handleClose}>
              Close
            </Button> */}
            </View>

            {isCalendarVisible && (
              <DatePicker
                style={styles.datePicker}
                mode="datepicker"
                onDateChange={handleDateChange}
                onTimeChange={handleTimeChange}
                placeholder={!isStartDateSelected ? 'Set Start Date' : 'Set Due Date'}
                display="spinner"
                date={selectedDate}
                minDate={new Date()}
              />
            )}
            {isPriorityVisible && priorityOptions}
          </View>
        </View>
      </KeyboardAvoidingView>

    </Modal >
  );
}
// completed pending 
export default TaskInput;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(250, 23, 712, 0.05)',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 3,
    right: 8,
    zIndex: 1,

  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    marginHorizontal: 10,
    alignItems: 'center'
  },
  textInput: {
    borderWidth: 1.5,
    borderColor: '#F6F6F6',
    backgroundColor: '#F6F6F6',
    color: COLORS.primary,
    borderRadius: 10,
    width: '100%',
    marginVertical: 8,
    padding: 16,
    fontWeight: 'bold',
  },
  charCount: {
    alignSelf: 'flex-end',
    color: COLORS.grey,
    marginTop: -6,
    marginRight: 12,
    fontSize: 9
  },
  // datePicker: {
  //   marginTop: 8,
  //   borderWidth: 1.5,
  //   borderColor: COLORS.primary,
  //   borderRadius: 10,
  //   height: '50%',
  //   marginVertical: 4,
  // },
  datePicker: {
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 10,
    height: "30%" // Adjust this value as needed
  },
  iconButton: {
    borderWidth: .3,
    borderColor: COLORS.primary,
    borderRadius: 8,
    borderStyle: 'solid',
    padding: 14,
    marginHorizontal: 5,
    alignItems: 'center'

  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    // alignItems: 'center',
    marginTop: 16,
  },
  priorityOptionsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  priorityOptionsContainer: {
    borderRadius: 10,
    padding: 16,
  },
  priorityOption: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 8,
    marginVertical: 8,
    borderRadius: 8,
  },
  highPriorityOption: {
    backgroundColor: '#cb5eda',
  },
  mediumPriorityOption: {
    backgroundColor: 'orange',
  },
  lowPriorityOption: {
    backgroundColor: '#dad5d5',
  },
  priorityOptionText: {
    color: COLORS.black,
  },
  selectedPriorityOptionText: {
    borderRadius: 8,
    color: COLORS.white,
  },
  instructionText: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    alignSelf: 'center'
  },
  infoIconContainer: {
    position: 'absolute',
    top: 3,
    left: 8,
    zIndex: 1,
  },
  infoMessageBubble: {
    position: 'absolute',
    top: 28,
    left: 36,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderTopLeftRadius: 0,
    padding: 12,
    elevation: 5, // Adds a bit of elevation for a raised effect
    marginBottom: 20,
    maxWidth: '90%', // Adjust the width as needed
    opacity: 0.7, // You can adjust the opacity here (1 for fully visible, 0 for fully transparent)
  },
  infoText: {
    fontSize: 14,
    width: '100%',
    color: '#331993',
  },
  centeredButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Center the buttons horizontally
    marginTop: 20,
  },
  emptyTaskMessage: {
    alignItems: 'center',
    marginTop: 20,
  },
  emptyTaskText: {
    color: COLORS.grey,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  iconLabelContainer: {
    marginTop: 4,

  },
  iconLabel: {
    fontSize: 12,
    color: COLORS.grey,
    textAlign: 'center',
  },
});
