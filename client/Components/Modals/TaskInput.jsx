import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, TextInput, Modal, TouchableOpacity, Keyboard, KeyboardAvoidingView, Pressable, ScrollView, Vibration } from 'react-native';
import { Button } from 'react-native-paper';
import DatePicker from 'react-native-modern-datepicker';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import RepeatTaskModal from './RepeatTaskModal';

function TaskInput(props) {
  const [enteredTaskText, setEnteredTaskText] = useState('');
  const [enteredDescription, setEnteredDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [dueTime, setDueTime] = useState(null);
  const [isStartDateSelected, setisStartDateSelected] = useState(false);
  const [isTitle, setisTitle] = useState(false);
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState('low');
  const [isPriorityVisible, setPriorityVisible] = useState(false);
  const [isStartTimeSelected, setIsStartTimeSelected] = useState(false)
  const [isDueTimeSelected, setDueTimeSelected] = useState(false)
  const [isRepeatTaskVissible, setIsRepeatTaskVissible] = useState(false)
  const [repeatTaskSaved, setRepeatTaskSaved] = useState(false);
  const [repeatOption, setRepeatOption] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [repeatSelectedTime, setRepeatSelectedTime] = useState(null)
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
    if (!enteredTaskText || !selectedDate || !selectedTime) {
      return;
    }

    if (!isStartDateSelected) {
      setStartDate(selectedDate);
      setStartTime(selectedTime);
      setisStartDateSelected(true);
      setIsStartTimeSelected(true);
    } else {
      setDueDate(selectedDate);
      setDueTime(selectedTime);
      setDueTimeSelected(true);
      setDueTimeSelected(true);

      // Check if it's a repeated task based on repeatTaskSaved
      if (repeatTaskSaved) {
        props.onAddTask(
          enteredTaskText,
          enteredDescription,
          startDate,
          selectedDate,
          startTime,
          selectedTime,
          selectedPriority,
          repeatTaskSaved, // Send current state of repteadTaskSaved ( saved \ not saved) -- Boolean
          repeatOption, // Pass the repeat option from the modal
          selectedDays, // Pass the selected days from the modal
          repeatSelectedTime
        );
      } else {
        props.onAddTask(
          enteredTaskText,
          enteredDescription,
          startDate,
          selectedDate,
          startTime,
          selectedTime,
          selectedPriority
        );
      }

      setEnteredTaskText('');
      setEnteredDescription('');
      setSelectedDate(null);
      setisStartDateSelected(false);
      setIsStartTimeSelected(false);
      setDueTimeSelected(false);
      setRepeatTaskSaved(false); // Reset the flag for the next task

      props.toggleBtn();
    }
  };


  const addQuickTaskHandler = () => {
    if (!enteredTaskText) {
      return;
    }

    console.log(enteredTaskText, enteredDescription, startDate, selectedDate, startTime, selectedTime, selectedPriority);
    props.onAddTask(
      enteredTaskText,
      enteredDescription,
      startDate,
      selectedDate,
      startTime,
      selectedTime,
      selectedPriority);

    setEnteredTaskText('');
    setEnteredDescription('');
    setSelectedDate(null);
    setSelectedTime(null);
    setStartDate('');
    setStartTime('');
    setDueDate(null);
    setDueTime(null);
    setisStartDateSelected(false);
    setIsStartTimeSelected(false);
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

  const handleToggleRepeat = () => {
    setIsRepeatTaskVissible(!isRepeatTaskVissible);
  };

  const handleToggleCalendar = () => {
    if (isPriorityVisible) {
      setPriorityVisible(!isPriorityVisible);
    }
    setCalendarVisible(!isCalendarVisible);
    Keyboard.dismiss()
  };
  const handleTogglePriority = () => {
    if (isCalendarVisible) {
      setCalendarVisible(!isCalendarVisible);
    }
    setPriorityVisible(!isPriorityVisible);
    Keyboard.dismiss()
  };

  const handlePrioritySelection = (priority) => {
    setSelectedPriority(priority);
    setPriorityVisible(false);
  };

  const handleRepeatTaskSave = (repeatOption) => {
    setRepeatSelectedTime(repeatOption.selectedTime.toLocaleTimeString())
    setRepeatOption(repeatOption.repeatOption);
    setSelectedDays(repeatOption.selectedDays);
    // Handle saving repetition settings in your task data or logic
    console.log('Repeat Option:', repeatOption);

    // Close the RepeatTaskModal and set repeatTaskSaved to true
    setIsRepeatTaskVissible(false);
    setRepeatTaskSaved(true);
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
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }} // Ensure the view takes up the full screen
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust behavior based on platform
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0} // Adjust offset as needed
        >

          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Close Button */}


              <TextInput
                placeholderTextColor={COLORS.grey}
                style={styles.textInput}
                placeholder="Insert task's title"
                onChangeText={taskInputHandler}
                value={enteredTaskText}
                maxLength={21}
              />

              {/* Description Input */}
              <TextInput
                placeholderTextColor={COLORS.grey}
                style={styles.textInput}
                placeholder="Insert task's description"
                onChangeText={descriptionInputHandler}
                value={enteredDescription}
                maxLength={400}
              />


              {/* Char Count */}
              <Text style={styles.charCount}>
                {enteredDescription.length}/400 characters
              </Text>



              <View style={styles.iconContainer}>
                <TouchableOpacity style={styles.iconButton} onPress={handleToggleCalendar}>
                  <Ionicons name="calendar" size={40} style={[{ color: COLORS.primary, }]} />
                  <View style={styles.iconLabelContainer}>
                    <Text style={styles.iconLabel}>Calendar</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={handleToggleRepeat}>
                  <Ionicons name="repeat" size={40} style={[{ color: COLORS.primary, }]} />
                  <View style={styles.iconLabelContainer}>
                    <Text style={styles.iconLabel}>Repeat</Text>
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
                      <Text style={styles.iconLabel}>Set Quick Task</Text>
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
                    onPress={() => {
                      setisStartDateSelected(false)
                      setIsStartTimeSelected(false)
                    }
                    }
                  >
                    Clear
                  </Button>
                )}
                <Button
                  style={styles.button}
                  mode="elevated"
                  onPress={addTaskHandler}
                  disabled={!enteredTaskText || !selectedTime || !selectedDate}
                >
                  {isStartDateSelected || isStartTimeSelected ? 'Set Due Date' : 'Set Start Date'}
                </Button>
                <Button style={styles.button} mode="contained-tonal" onPress={handleClose}>
                  Close
                </Button>
              </View>

              {isCalendarVisible && (
                <DatePicker
                  style={styles.datePicker}
                  mode="datepicker"
                  onDateChange={handleDateChange}
                  onTimeChange={handleTimeChange}
                  date={selectedDate}
                  minimumDateDate={new Date()}
                  options={Keyboard}
                />
              )}

              {isPriorityVisible && priorityOptions}
              {isRepeatTaskVissible && (
                <RepeatTaskModal
                  visible={isRepeatTaskVissible}
                  onSave={handleRepeatTaskSave}
                  onClose={handleToggleRepeat}

                />
              )}
            </View>
          </View>
        </KeyboardAvoidingView>

      </ScrollView>
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

  datePicker: {
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: COLORS.lightGray, // You can adjust the background color
    borderRadius: 8,
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



