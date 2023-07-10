import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Modal, Image } from 'react-native';
import { Button } from 'react-native-paper';
import DatePicker from 'react-native-modern-datepicker';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

function TaskInput(props) {
  const [enteredTaskText, setEnteredTaskText] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [isStartDateSelected, setIsStartDateSelected] = useState(false);

  const goalInputHandler = (enteredText) => {
    setEnteredTaskText(enteredText);
  };

 const addTaskHandler = () => {
    if (!enteredTaskText || !selectedDate) {
      return;
    }

    if (!isStartDateSelected) {
      setStartDate(selectedDate);
      setIsStartDateSelected(true);
    } else {
      setDueDate(selectedDate);
      console.log(enteredTaskText, startDate, selectedDate);
      props.onAddTask(enteredTaskText, startDate, selectedDate);
      setEnteredTaskText('');
      setSelectedDate(null);
      setIsStartDateSelected(false);
      props.toggleBtn();
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleClose = () => {
    props.onClose();
  };

  return (
    <Modal visible={props.visible} animationType="slide">
      <View style={styles.inputContainer}>
        <Ionicons
          name="close"
          size={24}
          color={COLORS.primary}
          style={styles.iconButton}
          onPress={handleClose}
        />
        <Image source={require('../assets/images/task.png')} style={styles.image} />
        <TextInput
          autoFocus={true}
          placeholderTextColor="#AAAAAA"
          style={styles.textInput}
          placeholder="Your next task!!"
          onChangeText={goalInputHandler}
          value={enteredTaskText}
        />
        <DatePicker
          style={styles.datePicker}
          mode="datepicker"
          onDateChange={handleDateChange}
          placeholder={!isStartDateSelected ? "Set Start Date" : "Set Due Date"}
          display="spinner"
          date={selectedDate}
          minDate={new Date()}
        />
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
  buttonText: {
    color: '#cccccc',
    fontSize: 18,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  textInput: {
    borderWidth: 1.5,
    borderColor: '#F6F6F6',
    backgroundColor: '#F6F6F6',
    color: '#E5BEEC',
    borderColor: '#917FB3',
    borderRadius: 10,
    width: '80%',
    marginRight: 8,
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
    width: '80%',
  },
  iconButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    padding: 4,
  }
  
});
