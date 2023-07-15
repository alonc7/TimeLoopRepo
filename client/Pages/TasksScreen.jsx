import React, { useEffect, useState,useContext } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FloatingAction } from "react-native-floating-action";
import { AntDesign } from '@expo/vector-icons';
import TaskInput from '../Components/TaskInput';
import GoalItem from '../Components/GoalItem';
import COLORS from '../constants/colors';
import { MainContext } from '../Components/Context/MainContextProvider';
import { v4 as uuidv4 } from 'uuid';

const TasksScreen = () => {
  const [modalIsVisible, setModalIsVisible] = useState(false); // boolean for visualise of the modal ( is it visual right now?)
  const [isHidden, setIsHidden] = useState(true); // boolean for setting the modal hidden or not. 
  const [taskList, setTaskList] = useState([]); // array of tasks 
  const [taskCounter, setTaskCounter] = useState(1); // use for id creating. 
  const { userId, setUserId } = useContext(MainContext);


  useEffect(() => {
    retrieveUserId();
  }, []);

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

  const displayUserTasks = async (userId) => {
    try {
      const response = await fetch(' ${Server_path}/api/${{userId}}.', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const tasksData = await response.json();
        setTaskList(tasksData);
      }
    } catch (err) {
      throw new Error(err);
    }

  };


  function toggleBtn() {
    setIsHidden(!isHidden);
  }

  function handleModalIsVisible() {
    setModalIsVisible(!modalIsVisible);
  }

  function addTaskHandler(title, startDate, dueDate, startTime, dueTime, priority) {
    setTaskList((currentListTasks) => [
      {
        text: title,
        startDate: startDate,
        dueDate: dueDate,
        key: uuidv4(),
        startTime: startTime,
        dueTime: dueTime,
        priority: priority
      },
      ...currentListTasks
    ]);
    console.log(title, startDate, dueDate, startTime, dueTime, priority);
    // setTaskCounter((currTaskCounter) => currTaskCounter + 1);
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
          key={taskCounter}
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
                priority={item.priority}
              />
            )}
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
