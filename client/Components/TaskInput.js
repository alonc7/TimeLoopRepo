import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TextInput, Modal, Text, Image } from 'react-native';
import { Button } from 'react-native-paper';
import DatePicker from 'react-native-modern-datepicker';
import COLORS from '../constants/colors';

function TaskInput(props) {
  const [enteredTaskText, setEnteredTaskText] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [isStartDateSelected, setIsStartDateSelected] = useState(false);

  const goalInputHandler = (enteredText) => {
    setEnteredTaskText(enteredText);
  };

  const addTaskHandler = () => {
    if (!enteredTaskText || !selectedDate) {
      return;
    }

    if (!isStartDateSelected) {
      setSelectedDate(null);
      setIsStartDateSelected(true);
    } else {
      const newTask = {
        task: enteredTaskText,
        startDate: selectedDate,
        dueDate: new Date(),
      };

      props.setTasks((prevTasks) => [...prevTasks, newTask]);
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
          <Button
            style={styles.button}
            mode="contained"
            onPress={addTaskHandler}
            disabled={!enteredTaskText || !selectedDate}
          >
            {isStartDateSelected ? 'Set Due Date' : 'Set Start Date'}
          </Button>
          <Button style={styles.button} mode="outlined" onPress={handleClose}>
            Cancel
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
});
