import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, TextInput, Modal, Image, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import DatePicker from 'react-native-modern-datepicker';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

function TaskInput(props) {
  const [enteredTaskText, setEnteredTaskText] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState();
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [dueTime, setDueTime] = useState(null);
  const [isStartDateSelected, setIsStartDateSelected] = useState(false);
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState('low');
  const [isPriorityVisible, setPriorityVisible] = useState(false);
  // const dropDownAlertRef = useContext(AlertContext);


  const taskInputHandler = (enteredText) => {
    setEnteredTaskText(enteredText);
  };

  const addTaskHandler = () => {
    if (!enteredTaskText || !selectedDate) {
      return;
    }

    if (!isStartDateSelected) {
      setStartDate(selectedDate);
      setStartTime(selectedTime);
      setIsStartDateSelected(true);
    } else {
      setDueDate(selectedDate);
      setDueTime(selectedTime);
      props.onAddTask(enteredTaskText, startDate, selectedDate, startTime, selectedTime, selectedPriority);
      // dropDownAlertRef.current.alertWithType('success', 'Success', 'Task added successfully.');

      setEnteredTaskText('');
      setSelectedDate(null);
      setIsStartDateSelected(false);
      props.toggleBtn();
    }
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
    <Modal visible={props.visible} animationType="slide"
    // onShow={info}
    >
      <View style={styles.inputContainer}>
        <Image source={require('../assets/images/task.png')} style={styles.image} />
        <TextInput
          autoFocus={true}
          placeholderTextColor="#AAAAAA"
          style={styles.textInput}
          placeholder="Your next task!!"
          onChangeText={taskInputHandler}
          value={enteredTaskText}
        />

        <View style={styles.iconContainer}>
          <Ionicons
            name="calendar"
            size={40}
            color={COLORS.black}
            style={styles.iconButton}
            onPress={handleToggleCalendar}
          />
          <Ionicons
            name="md-options"
            size={40}
            color={COLORS.black}
            style={styles.iconButton}
            onPress={handleTogglePriority}
          />
        </View>
        <View style={styles.buttonContainer}>
          {isStartDateSelected && (
            <Button
              style={styles.button}
              mode="outlined"
              onPress={() => setIsStartDateSelected(false)}
            >
              Clear
            </Button>
          )}
          <Button
            style={styles.button}
            mode="contained"
            onPress={addTaskHandler}
            disabled={!enteredTaskText || !selectedDate}
          >
            {isStartDateSelected ? 'Set Due Date' : 'Set Start Date'}
          </Button>
          <Button style={styles.button} mode="outlined" onPress={handleClose}>
            Close
          </Button>
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
    </Modal>
  );
}
// completed pending 
export default TaskInput;

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.secondary,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    marginHorizontal: 10,
  },
  textInput: {
    borderWidth: 1.5,
    borderColor: '#F6F6F6',
    backgroundColor: '#F6F6F6',
    color: '#E5BEEC',
    borderColor: '#917FB3',
    borderRadius: 10,
    width: '80%',
    marginVertical: 8,
    padding: 16,
    fontWeight: 'bold',
  },
  image: {
    height: 100,
    width: 100,
    justifyContent: 'flex-end',
    borderRadius: 4,
    marginBottom: 50,
  },
  datePicker: {
    marginTop: 8,
    borderWidth: 1.5,
    color: '#E5BEEC',
    borderColor: '#917FB3',
    borderRadius: 10,
    width: '80%',
    height: '50%',
    marginVertical: 8,
  },
  iconButton: {
    borderWidth: 1.5,
    borderColor: '#917FB3',
    borderRadius: 8,
    padding: 4,
    marginHorizontal: 5

  },
  iconContainer: {
    flexDirection: 'row',
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
    backgroundColor: 'red',
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
  },
});
