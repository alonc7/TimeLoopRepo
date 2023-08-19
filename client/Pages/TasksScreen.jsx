import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FloatingAction } from "react-native-floating-action";
import { AntDesign } from '@expo/vector-icons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TaskInput from '../Components/Modals/TaskInput';
import GoalItem from '../Components/GoalItem';
import COLORS from '../constants/colors';
import { MainContext } from '../Components/Context/MainContextProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Server_path } from '../utils/api-url';
import FloatingActionBtn from '../Components/Modals/FloatingActionBtn'
const TasksScreen = () => {
  const [modalIsVisible, setModalIsVisible] = useState(false); // boolean for visualise of the modal ( is it visual right now?)
  const [isHidden, setIsHidden] = useState(true); // boolean for setting the modal hidden or not. 
  const { userEmail, setUserId, pendingTaskList, setPendingTaskList } = useContext(MainContext);

  function toggleBtn() {
    setIsHidden(!isHidden);
  }

  function handleModalIsVisible() {
    setModalIsVisible(!modalIsVisible);
  }

  const addTaskHandler = async (title, description, startDate, dueDate, startTime, dueTime, priority) => {
    const taskData = {
      title: title,
      description: description,
      startDate: startDate,
      description: description,
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
          setPendingTaskList([...pendingTaskList, taskData])
          Alert.alert('Task added successfully')
        } else {
          Alert.alert('Failed to create task:', response.status)
        }
      })
      .catch(error => {
        console.error('Error creating task:', error);
      });

  }

  function deleteTaskHandler(id) {
    // Perform the API fetch request to remove the task from the server
    fetch(`${Server_path}/api/tasks/removeTask`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userEmail, taskId: id }), // 'id' is the task ID passed from GoalItem
    })
      .then(response => {
        if (response.ok) {
          // Now update the taskList state to remove the task from the view
          setPendingTaskList((currentListTasks) =>
            currentListTasks.filter((task) => task._id !== id)
          );
          Alert.alert('Task removed successfully');
        } else {
          console.log('Failed to remove task:', response.status);
        }
      })
      .catch(error => {
        console.error('Error removing task:', error);
      });
  }


  const taskActions = [
    {
      text: 'Scheduled Task',
      icon: <AntDesign name="pluscircleo" size={20} color="white" />,
      name: 'add_task',
      position: 1,
    },
  ];


  return (
    <LinearGradient
      style={styles.container}
      colors={[COLORS.secondary, COLORS.primary]}
    >
      <View style={styles.container}>
        {modalIsVisible && (
          <View>
            <TaskInput
              visible={modalIsVisible}
              onAddTask={addTaskHandler}
              onClose={handleModalIsVisible}
              toggleBtn={toggleBtn}
              setTasks={setPendingTaskList}
            />
          </View>)}
        <View>
          <FlatList
            contentContainerStyle={{ justifyContent: 'center' }}
            data={pendingTaskList}
            renderItem={({ item }) => (
              <GoalItem
                text={item.title}
                description={item?.description}
                startDate={item?.startDate}
                endDate={item?.dueDate}
                id={item._id}
                startHour={item?.startTime}
                endHour={item?.dueTime}
                onDeleteItem={deleteTaskHandler}
                priority={item?.priority}
              />
            )}
            keyExtractor={(item, index) => item._id || index.toString()} // Use _id if available, fallback to index
            alwaysBounceVertical={false}
          />


          <FloatingAction
            color={COLORS.secondary}
            position={'left'}
            buttonSize={30}
            overrideWithAction={true}
            showBackground={false}
            actions={taskActions}
            onPressItem={handleModalIsVisible}
          />
          <FloatingActionBtn />
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
    flex: 1
  },
  // buttonText: {
  //   flexDirection: 'row',
  //   color: '#B2A4FF',
  //   fontSize: 18,
  //   textDecorationLine: 'underline',
  //   fontWeight: 'bold',
  //   marginBottom: 40,
  //   justifyContent: 'center',
  // },
  // btnHide: {
  //   display: 'none'
  // }
});

export default TasksScreen;
