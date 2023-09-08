import React, { useState, useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { FloatingAction } from "react-native-floating-action";
import { AntDesign } from '@expo/vector-icons';
import TaskInput from '../Components/Modals/TaskInput';
import GoalItem from '../Components/GoalItem';
import COLORS from '../constants/colors';
import { MainContext } from '../Components/Context/MainContextProvider';
import FloatingActionBtn from '../Components/Modals/FloatingActionBtn'
import SearchBar from '../Components/SearchBar';
import UndoMessage from '../Components/UndoMessage';

const TasksScreen = () => {
  const [modalIsVisible, setModalIsVisible] = useState(false); // boolean for visualise of the modal ( is it visual right now?)
  const [isHidden, setIsHidden] = useState(true); // boolean for setting the modal hidden or not. 
  const { userEmail, pendingTaskList, setPendingTaskList, addTask, handleEditTask } = useContext(MainContext);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedDays, setSelectedDays] = useState([]);


  function toggleBtn() {
    setIsHidden(!isHidden);
  }

  function handleModalIsVisible() {
    setModalIsVisible(!modalIsVisible);
  }
  // Create a mapping to store temporary IDs and their corresponding MongoDB IDs
  const idMapping = new Map();

  // Function to generate temporary IDs
  function generateTempId() {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 10000);
    const tempId = `${timestamp}_${random}`;
    // Store the temporary ID in the mapping
    idMapping.set(tempId, null); // Initialize with no MongoDB ID
    return tempId;
  }

  // When adding a new task
  const addTaskHandler = async (title, description, startDate, dueDate, startTime, dueTime, priority, isRepeat, repeatOption, selectedDays, repeatSelectedTime) => {
    const _id = generateTempId();
    const taskData = {
      title: title,
      description: description,
      startDate: startDate,
      dueDate: dueDate,
      startTime: startTime,
      dueTime: dueTime,
      priority: priority,
      isRepeat: isRepeat,
      repeatOption: repeatOption,
      selectedDays: selectedDays,
      repeatSelectedTime: repeatSelectedTime,
      _id: _id
    };
    addTask(taskData);
  };

  // function deleteTaskHandler(id) {
  //   // Perform the API fetch request to remove the task from the server
  //   fetch(`${Server_path}/api/tasks/removeTask`, {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ userEmail, taskId: id }), // 'id' is the task ID passed from GoalItem
  //   })
  //     .then(response => {
  //       if (response.ok) {
  //         // Now update the taskList state to remove the task from the view
  //         setPendingTaskList((currentListTasks) =>
  //           currentListTasks.filter((task) => task._id !== id)
  //         );
  //         Alert.alert('Task removed successfully');
  //       } else {
  //         console.log('Failed to remove task:', response.status);
  //       }
  //     })
  //     .catch(error => {
  //       console.error('Error removing task:', error);
  //     });
  // }



  const taskActions = [
    {
      text: 'Scheduled Task',
      icon: <AntDesign name="pluscircleo" size={34} color="white" />,
      name: 'add_task',
      position: 1,
    },
  ];


  return (
    <LinearGradient
      style={styles.container}
      colors={[COLORS.secondary, COLORS.primary]}
    >
      <SearchBar value={searchQuery} onChangeText={(text) => setSearchQuery(text)} />
      <View style={styles.container}>
        {modalIsVisible && (
          <View>
            <TaskInput
              visible={modalIsVisible}
              onAddTask={addTaskHandler}
              onClose={handleModalIsVisible}
              toggleBtn={toggleBtn}
              setTasks={setPendingTaskList}
              selectedDays={selectedDays} // Pass selectedDays as a prop

            />
          </View>)}
        <View>
          <FlatList
            contentContainerStyle={{ justifyContent: 'center' }}
            data={pendingTaskList.filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase()))}
            renderItem={({ item }) => (
              <GoalItem
                text={item.title}
                description={item?.description}
                startDate={item?.startDate}
                endDate={item?.dueDate}
                task_id={item._id}
                startHour={item?.startTime}
                endHour={item?.dueTime}
                priority={item?.priority}
                // onDeleteItem={deleteTask}
                onSave={(editedTask) => {
                  handleEditTask(userEmail, editedTask);                            // Implement the onSave logic here
                  // setIsEditModalVisible(false); // Hide the EditTaskModal
                }}
              />
            )}
            keyExtractor={(item, index) => item._id || index.toString()} // Use _id if available, fallback to index
            alwaysBounceVertical={false}
          />


          <FloatingAction
            color={COLORS.secondary}
            position={'left'}
            buttonSize={34}
            overrideWithAction={true}
            showBackground={false}
            actions={taskActions}
            onPressItem={handleModalIsVisible}
          />
          <FloatingActionBtn />
          <UndoMessage />
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
});

export default TasksScreen;
