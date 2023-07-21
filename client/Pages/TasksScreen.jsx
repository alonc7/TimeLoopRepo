import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FloatingAction } from "react-native-floating-action";
import { AntDesign } from '@expo/vector-icons';
import TaskInput from '../Components/TaskInput';
import GoalItem from '../Components/GoalItem';
import COLORS from '../constants/colors';
import { MainContext } from '../Components/Context/MainContextProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { Server_path } from '../utils/api-url';

const TasksScreen = () => {
  const [modalIsVisible, setModalIsVisible] = useState(false); // boolean for visualise of the modal ( is it visual right now?)
  const [isHidden, setIsHidden] = useState(true); // boolean for setting the modal hidden or not. 
  const [taskList, setTaskList] = useState([]); // array of tasks 
  const { userEmail, setUserId } = useContext(MainContext);


  useEffect(() => {
    // retrieveUserId();
    const loadTask = async (userEmail) => {
      try {
        const response = await fetch(`${Server_path}/api/tasks/getPendingTaskList/${userEmail}`);
        if (response.ok) {
          const data = await response.json();
          setTaskList(data)

        }
        throw new Error('Request failed');

      } catch (error) {
        // const message = `An error has occured in TaskScreen: ${error.message}`;
        // console.log(message);
      }
    }
    loadTask(userEmail);
  }, [taskList]);



  const retrieveUserId = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString !== null) {
        const userData = JSON.parse(userDataString);
        setUserId(userData.id);
      }
    } catch (error) {
      console.log('Error retrieving user data:', error);
    }
  };



  function toggleBtn() {
    setIsHidden(!isHidden);
  }

  function handleModalIsVisible() {
    setModalIsVisible(!modalIsVisible);
  }

  const addTaskHandler = async (title, startDate, dueDate, startTime, dueTime, priority) => {
    const taskData = {
      title: title,
      startDate: startDate,
      dueDate: dueDate,
      startTime: startTime,
      dueTime: dueTime,
      priority: priority,
      userEmail: userEmail
    };
    const response = await fetch(`${Server_path}/api/tasks/addTask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskData)
    })
      .then(response => {
        if (response.ok) {
          console.log('Task created successfully');
        } else {
          console.log('Failed to create task:', response.status);
        }
      })
      .catch(error => {
        console.error('Error creating task:', error);
      });

  }

  function deleteAllTasks(key) {
    setTaskList([]);
    toggleBtn();
  }

  // const deleteTaskHandler = async()
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
        />
        <View style={styles.tasksContainer}>
          <FlatList
            contentContainerStyle={{ justifyContent: 'center' }}
            data={taskList}
            renderItem={({ item }) => (
              <GoalItem
                text={item.title}
                startDate={item.startDate}
                endDate={item.dueDate}
                id={item._id}
                startHour={item?.startTime}
                endHour={item?.dueTime}
                onDeleteItem={deleteTaskHandler}
                priority={item.priority}
              />
            )}
            // keyExtractor={(item, key) => key.toString()}
            keyExtractor={(item, key) => key.toString()}
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
            onPressItem={handleModalIsVisible}


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
