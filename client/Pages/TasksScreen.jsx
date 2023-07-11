import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FloatingAction } from "react-native-floating-action";
import { AntDesign } from '@expo/vector-icons';
import TaskInput from '../Components/TaskInput';
import GoalItem from '../Components/GoalItem';
import COLORS from '../constants/colors';

const TasksScreen = () => {
  const [modalIsVisible, setModalIsVisible] = useState(false); // boolean for visualise of the modal ( is it visual right now?)
  const [isHidden, setIsHidden] = useState(true); // boolean for setting the modal hidden or not. 
  const [taskList, setTaskList] = useState([]); // array of tasks 
  const [counter, setCounter] = useState(1); // use for id creating. 

  function toggleBtn() {
    setIsHidden(!isHidden);
  }

  function handleModalIsVisible() {
    setModalIsVisible(!modalIsVisible);
  }

  function addTaskHandler(title, startDate, dueDate, startTime, dueTime) {
    setTaskList((currentListTasks) => [
      ...currentListTasks,
      {
        text: title,
        startDate: startDate,
        dueDate: dueDate,
        key: counter,
        startTime: startTime,
        dueTime: dueTime
      },
    ]);
    console.log(counter, title, startDate, dueDate);
    setCounter((currCounter) => currCounter + 1);
    handleModalIsVisible();
  }

  function deleteAllTasks() {
    setTaskList([]);
    toggleBtn();
  }

  function deleteTaskHandler(id) {
    setTaskList((currentListTasks) =>
      currentListTasks.filter((task) => task.key !== id)
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
        <View style={styles.tasksContainer}>
          <FlatList
            contentContainerStyle={{ justifyContent: 'center' }}
            data={taskList}
            renderItem={({ item }) => (
              <GoalItem
                text={item.text}
                startDate={item.startDate}
                endDate={item.dueDate}
                id={item.key}
                startHour={item?.startTime}
                endHour={item?.dueTime}
                onDeleteItem={deleteTaskHandler}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            alwaysBounceVertical={false}
          />
          <Pressable
            style={[styles.buttonText, isHidden && styles.btnHide]}
            onPress={deleteAllTasks}
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


  tasksContainer: {
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
