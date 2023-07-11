import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Modal, Image, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import DatePicker from 'react-native-modern-datepicker';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

function TaskInput(props) {
  const [enteredTaskText, setEnteredTaskText] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [dueTime, setDueTime] = useState(null);
  const [isStartDateSelected, setIsStartDateSelected] = useState(false);
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState(null);

  const goalInputHandler = (enteredText) => {
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
      props.onAddTask(enteredTaskText, startDate, selectedDate, startTime, selectedTime);
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
    setCalendarVisible(!isCalendarVisible);
  };

  const handlePrioritySelection = (priority) => {
    setSelectedPriority(priority);
  };
  const priorityOptions = (
    <View style={styles.priorityOptionsContainer}>
      <TouchableOpacity
        style={[
          styles.priorityOption,
          selectedPriority === 'high' && styles.selectedPriorityOption,
        ]}
        onPress={() => handleOptionSelection('high')}
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
          selectedPriority === 'medium' && styles.selectedPriorityOption,
        ]}
        onPress={() => handleOptionSelection('medium')}
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
          selectedPriority === 'low' && styles.selectedPriorityOption,
        ]}
        onPress={() => handleOptionSelection('low')}
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
    <Modal visible={props.visible} animationType="slide">
      <View style={styles.inputContainer}>
        <Image source={require('../assets/images/task.png')} style={styles.image} />
        <TextInput
          autoFocus={true}
          placeholderTextColor="#AAAAAA"
          style={styles.textInput}
          placeholder="Your next task!!"
          onChangeText={goalInputHandler}
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
            onPress={() => handlePrioritySelection({ priorityOptions })}
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
      </View>
    </Modal>
  );
}

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
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    padding: 16,
  },
  priorityOption: {
    padding: 8,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  selectedPriorityOption: {
    backgroundColor: COLORS.primary,
  },
  priorityOptionText: {
    color: COLORS.black,
  },
  selectedPriorityOptionText: {
    color: COLORS.white,
  },
});
