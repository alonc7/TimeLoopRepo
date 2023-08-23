import React, { createContext, useEffect, useState } from 'react'
import { Server_path } from '../../utils/api-url';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const MainContext = createContext()

function MainContextProvider({ children }) {

  const [authenticated, setAuthenticated] = useState(false)
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [allTasks, setAllTasks] = useState([]);
  const [pendingTaskList, setPendingTaskList] = useState([]);
  const [completedTaskList, setCompletedTaskList] = useState([]);
  const [userImage, setUserImage] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // State to manage the visibility of EditTaskModal
  const [selectedTask, setSelectedTask] = useState(null); // State to hold the selected task for editing
  const [deletedTasksList, setDeletedTasks] = useState([]);
  //Const 
  const MAX_FOR_DELETE = 3;
  const MAX_FOR_COMPLETE = 5;
  const MAX_FOR_ADD = 5;
  // Use useEffect to save deleted tasks to AsyncStorage
  useEffect(() => {
    async function saveDeletedTasksToStorage() {
      try {
        await AsyncStorage.setItem('deletedTasks', JSON.stringify(deletedTasksList));
      } catch (error) {
        console.error('Error saving deleted tasks to AsyncStorage:', error);
      }
    }

    saveDeletedTasksToStorage();
  }, [deletedTasksList]);

  // Use useEffect to retrieve deleted tasks from AsyncStorage on component mount
  useEffect(() => {
    async function getDeletedTasksFromStorage() {
      try {
        const storedDeletedTasks = await AsyncStorage.getItem('deletedTasksList');
        if (storedDeletedTasks) {
          setDeletedTasks(JSON.parse(storedDeletedTasks));
        }
      } catch (error) {
        console.error('Error retrieving deleted tasks from AsyncStorage:', error);
      }
    }

    getDeletedTasksFromStorage();
  }, []);


  //HomeScreen method
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const saveUserImage = async () => {
    try {
      if (userImage) {
        await AsyncStorage.setItem('userImage', userImage);
        console.log('user image saved successfully');
      } else
        await AsyncStorage.removeItem('userImage');
    } catch (error) {
      console.log('Error saving user image', error);
    }
  };
  const getCurrentWeekTasks = () => {
    // Get today's date
    const today = new Date();

    // Calculate the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const dayOfWeek = today.getDay();
    console.log(dayOfWeek);
    // Calculate the start and end dates of the current week
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - dayOfWeek); // Set to the beginning of the week (Sunday)
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(today);
    endDate.setDate(today.getDate() + (6 - dayOfWeek)); // Set to the end of the week (Saturday)
    endDate.setHours(23, 59, 59, 999);

    // Iterate through tasks and check if the start date is within the current week
    const tasksForThisWeek = pendingTaskList.filter(task => {
      const taskStartDate = new Date(task.startDate);
      return taskStartDate >= startDate && taskStartDate <= endDate;
    });

    if (tasksForThisWeek > 0) {
      return tasksForThisWeek;
    }
    else {
      return []
    }
  }
  const getTodayTasks = () => {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '/');
    return tasksOfToday = pendingTaskList.filter(task => task.startDate === today);

  }

  //fetch async all tasks from mongo db 
  const loadAllTasks = async (userEmail) => {
    try {
      const response = await fetch(`${Server_path}/api/tasks/allTasks/${userEmail}`);
      if (response.ok) {
        const data = await response.json();
        setAllTasks(data);

      } else {
        throw new Error('Request failed');
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  async function deleteTask(taskId) {
    try {
      updatePendingTaskHandler(taskId);
      let tasksToDelete = [...deletedTasksList, taskId];
      console.log('tasksToDelete', tasksToDelete)
      setPendingTaskList((prev) => prev.filter((task) => task._id !== taskId));
      if (tasksToDelete.length < MAX_FOR_DELETE) {
        //update ui
        setDeletedTasks((prev) => [...prev, taskId]);
        // alert('Task removed successfully', taskId);
        return;
      }


      // fetch after the bucket is full
      const response = await fetch(`${Server_path}/api/tasks/delete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userEmail, deletedTasks: tasksToDelete })
      });

      if (response.ok) {

      }
      else {
        alert('Failed to remove task:', response.status);
      }
    } catch (error) {
      console.error('Error removing task:', error);
    }

    console.log('tasksToDelete', tasksToDelete)

  };
//   async function deleteTask(taskId) {
//     try {
//       let tasksToDelete;

//       // Check if the task has a valid MongoDB ID or not
//       if (taskId.startsWith('temp_')) {
//         tasksToDelete = deletedTasksList.filter(id => id !== taskId);
//       } else {
//         tasksToDelete = deletedTasksList.concat([taskId]);
//       }
// lo
//       // Update the state with the new tasksToDelete
//       setDeletedTasks(tasksToDelete);

//       if (tasksToDelete.length == MAX_FOR_DELETE) {
//         await sendTasksToDelete();
//       }

//       // Call the function to send tasks to the backend

//     } catch (error) {
//       console.error('Error removing task:', error);
//     }
//   }

  // Function to send tasks to the backend for deletion
  async function sendTasksToDelete() {

    try {
      const tasksWithMongoIds = deletedTasksList.map(taskId => {
        if (taskId.startsWith('temp_')) {
          // Use the mapping to get the corresponding MongoDB ID
          const mongoId = idMapping.get(taskId);
          return { tempId: taskId, mongoId: mongoId };
        } else {
          // For tasks with a MongoDB ID, send as is
          return { mongoId: taskId };
        }
      });

      const response = await fetch(`${Server_path}/api/tasks/delete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userEmail, deletedTasks: tasksWithMongoIds })
      });

      if (response.ok) {
        // Clear the deleted tasks list
        setDeletedTasks([]);
      } else {
        console.error('Failed to remove tasks:', response.status);
      }
    } catch (error) {
      console.error('Error sending tasks to delete:', error);
    }
  }

  async function completeTask(taskId) {
    try {
      let tasksToComplete = [...completedTaskList, taskId];
      console.log('completedTaskList', completedTaskList)
      setPendingTaskList((prev) => prev.filter((task) => task._id !== taskId));
      if (tasksToComplete.length < MAX_FOR_DELETE) {
        //update ui
        setCompletedTaskList((prev) => [...prev, taskId]);
        // alert('Task removed successfully', taskId);
        return;
      }
      const response = await fetch(`${Server_path}/api/tasks/completeTask`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail, taskId }),
      });
      if (response.ok) {
        const completedTask = pendingTaskList.find((task) => task._id === taskId);
        const updatedTaskList = pendingTaskList.filter((task) => task._id !== taskId);

        setCompletedTaskList([...completedTaskList, completedTask])
        setPendingTaskList(updatedTaskList);
        Alert.alert('Task completed successfully');
      } else {
        Alert.alert('Failed to complete task:', response.status);
      }
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };
  async function addTask(taskObj) {
    //update local storage with the new task
    const updatedPendingTasks = [...pendingTaskList, taskObj];
    await AsyncStorage.setItem('pendingTasks', JSON.stringify(updatedPendingTasks))

    setPendingTaskList(updatedPendingTasks)

    console.log(taskObj);
    try {
      const response = await fetch(`${Server_path}/api/tasks/addTask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskObj)
      })
        .then(response => {
          if (response.ok) {
            setPendingTaskList([...pendingTaskList, taskObj])
            // Alert.alert('Task added successfully')
          } else {
            Alert.alert('Failed to create task:', response.status)
          }
        })
        .catch(error => {
          console.error('Error creating task:', error);
        });
    } catch (error) {

    }
  }


  const handleOnCancel = () => {
    setSelectedTask('')
    setIsEditModalVisible(false)
  };
  const handleEdit = (taskId) => {
    const taskToEdit = pendingTaskList.find((task) => task._id === taskId);
    setSelectedTask(taskToEdit); // Set the selected task for editing
    setIsEditModalVisible(true); // Show the EditTaskModal
  };
  const handleEditTask = async (userEmail, updatedTask) => {
    try {
      const response = await axios.put(`${Server_path}/api/tasks/editTask`, {
        userEmail,
        updatedTask
      });
      if (response.status === 200) {
        setIsEditModalVisible(false); // Hide the EditTaskModal
        alert('Task updated successfully');
      } else {
        alert('Something went wrong with task updating');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong with task updating');
    }
  };
  // const loadTasks = async (userEmail) => {
  //   try {
  //     const [pendingResponse, completedResponse,
  //       // getRemovedTaskList,
  //       allTasks] = await Promise.all([
  //         fetch(`${Server_path}/api/tasks/getPendingTaskList/${userEmail}`),
  //         fetch(`${Server_path}/api/tasks/getCompletedTaskList/${userEmail}`),
  //         // fetch(`${Server_path}/api/tasks/getRemovedTaskList/${userEmail}`),
  //         fetch(`${Server_path}/api/tasks/allTasks/${userEmail}`)
  //       ]);

  //     if (pendingResponse.ok && completedResponse.ok && allTasks.ok
  //       // getRemovedTaskList.ok &&
  //     ) {
  //       const pendingData = await pendingResponse.json();
  //       const completedData = await completedResponse.json();
  //       const allData = await allTasks.json();
  //       setPendingTaskList(pendingData);
  //       setCompletedTaskList(completedData);
  //       setAllTasks(allData);
  //     } else {
  //       throw new Error('Request failed');
  //     }
  //   } catch (error) {
  //     console.error('Error loading tasks:', error);
  //     setError('Error loading tasks'); // Set error state for user feedback
  //   } finally {
  //     setIsLoading(false); // Set loading state to false after loading tasks (regardless of success or error)
  //   }
  // }
  const loadLocalTasks = async () => {
    try {
      const localPendingString = await AsyncStorage.getItem('pendingTasks');
      const localCompletedString = await AsyncStorage.getItem('completedTasks');
      const localDeletedString = await AsyncStorage.getItem('deletedTasks');

      const localPending = localPendingString ? JSON.parse(localPendingString) : [];
      const localCompleted = localCompletedString ? JSON.parse(localCompletedString) : [];
      const localDeleted = localDeletedString ? JSON.parse(localDeletedString) : [];

      setPendingTaskList(localPending);
      setCompletedTaskList(localCompleted);
      setDeletedTasks(localDeleted);
    } catch (error) {
      console.error('Error loading local tasks:', error);
    }
  };


  const storeLocalTasks = async () => {
    try {
      await AsyncStorage.setItem('pendingTasks', JSON.stringify(pendingTaskList));
      await AsyncStorage.setItem('completedTasks', JSON.stringify(completedTaskList));
      await AsyncStorage.setItem('deletedTasks', JSON.stringify(deletedTasksList))
    } catch (error) {
      console.error('Error storing local tasks:', error);
    }
  };

  const loadTasks = async (userEmail) => {
    try {
      const [pendingResponse, completedResponse, allTasksResponse] = await Promise.all([
        fetch(`${Server_path}/api/tasks/getPendingTaskList/${userEmail}`),
        fetch(`${Server_path}/api/tasks/getCompletedTaskList/${userEmail}`),
        fetch(`${Server_path}/api/tasks/allTasks/${userEmail}`)
      ]);

      if (pendingResponse.ok && completedResponse.ok && allTasksResponse.ok) {
        const pendingData = await pendingResponse.json();
        const completedData = await completedResponse.json();
        const allData = await allTasksResponse.json();

        // Update local tasks
        setPendingTaskList(pendingData);
        setCompletedTaskList(completedData);
        setAllTasks(allData);
      } else {
        throw new Error('Request failed');
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      setError('Error loading tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePendingTaskHandler = async (taskId) => {
    try {
      // Filter out the task to be removed
      const updatedPendingTasks = pendingTaskList.filter(task => task._id !== taskId);

      // Update the local storage with the new task list
      await AsyncStorage.setItem('pendingTasks', JSON.stringify(updatedPendingTasks));

      // Update the state to reflect the removed task
      setPendingTaskList(updatedPendingTasks);
    } catch (error) {
      console.error('Error removing task:', error);
    }
  };


  const MainContextValues = {
    isLoading, setIsLoading, setAuthenticated, authenticated, setUserName, userName, userId,
    setUserId, userEmail, setUserEmail, capitalizeFirstLetter, setCompletedTaskList,
    setPendingTaskList, pendingTaskList, completedTaskList, allTasks, setAllTasks, userImage,
    setUserImage, deleteTask, completeTask, handleOnCancel, handleEdit, selectedTask, handleEditTask,
    isEditModalVisible, getTodayTasks, getCurrentWeekTasks, loadTasks, storeLocalTasks, loadLocalTasks, addTask
  }

  return (
    <MainContext.Provider value={MainContextValues}>
      {children}
    </MainContext.Provider>
  )
}
export default MainContextProvider;



