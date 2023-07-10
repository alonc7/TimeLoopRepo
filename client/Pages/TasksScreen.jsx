import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FloatingAction } from "react-native-floating-action";
import { AntDesign } from '@expo/vector-icons';
import TaskInput from '../Components/TaskInput';
import GoalItem from '../Components/GoalItem';
import COLORS from '../constants/colors';

const TasksScreen = () => {
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [isHidden, setIsHidden] = useState(true);
  const [counter, setCounter] = useState(1);

  function toggleBtn() {
    setIsHidden(!isHidden);
  }

  function handleModalIsVisible() {
    setModalIsVisible(!modalIsVisible);
  }

  function addTaskHandler( title, startDate, dueDate ) {
    setTaskList((currentListGoals) => [
      ...currentListGoals,
      {
        text: title,
        startDate: startDate,
        dueDate: dueDate,
        key: counter,
      },
    ]);
    console.log(counter,title,startDate,dueDate);
    setCounter((currCounter) => currCounter + 1);
    handleModalIsVisible();
  }

  function deleteAllGoals() {
    setTaskList([]);
    toggleBtn();
  }

  function deleteGoalHandler(id) {
    setTaskList((currentListGoals) =>
      currentListGoals.filter((goal) => goal.key !== id)
    );
  }

  const actions = [
    {
      text: 'Add Task',
      icon: <AntDesign name="plus" size={20} color="white" />,
      name: 'add_task',
      position: 2,
    },
  ];
  return (
    <LinearGradient
      style={styles.container}
      colors={[COLORS.secondary, COLORS.primary]}
    >
      <View style={styles.container}>
        <TaskInput
          visible={modalIsVisible}
          onAddTask={addTaskHandler}
          onClose={handleModalIsVisible}
          toggleBtn={toggleBtn}
          setTasks={setTaskList}
          key={counter}
        />
        <View style={styles.goalsContainer}>
          <FlatList
            contentContainerStyle={{ justifyContent: 'center' }}
            data={taskList}
            renderItem={({ item }) => (
              <GoalItem
              text="Get Hair Cut"
              startDate="2023-07-10"
              endDate="2023-07-12"
              startHour="10:00 AM"
              endHour="12:00 PM"
              totalTime="2 hours"
              onDeleteItem={deleteGoalHandler}
            />
            )}
            keyExtractor={(item, index) => index.toString()}
            alwaysBounceVertical={false}
          />
          <Pressable
            style={[styles.buttonText, isHidden && styles.btnHide]}
            onPress={deleteAllGoals}
          >
            <Text style={styles.buttonText}>Delete All Tasks</Text>
          </Pressable>
          <FloatingAction
            color='#222222'
            position={'left'}
            buttonSize={30}
            overrideWithAction={true}
            showBackground={false}
            actions={actions}
            onPressItem={name => {
              handleModalIsVisible();
            }}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },


  goalsContainer: {
    flex: 5
  },
  buttonText: {
    flexDirection: 'row',
    color: '#B2A4FF',
    fontSize: 18,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    marginBottom: 40,
    justifyContent: 'center',
  },
  btnHide: {
    display: 'none'
  }
});

export default TasksScreen;
