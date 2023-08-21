import React, { createContext, useState } from 'react'
import { Server_path } from '../../utils/api-url';
import axios from 'axios';

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
  const [removedTasksList, setRemovedTasksList] = useState([]);
  const [deletedTasks, setDeletedTasks] = useState([]);

  //Const 
  const MAX_FOR_DELETE = 2;


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
      // const response = await fetch(`${Server_path}/api/tasks/removeTask`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ userEmail, taskId }),
      // });
      // if (response.ok) {
      //   const removedTask = pendingTaskList.find((task) => task._id === taskId);
      //   const updatedTaskList = pendingTaskList.filter((task) => task._id !== taskId);

      //   setPendingTaskList(updatedTaskList);
      //   setRemovedTasksList(removedTask);
      //   alert('Task removed successfully', taskId);
      // } else {
      //   alert('Failed to remove task:', response.status);
      // }

      let tasksToDelete = [...deletedTasks, taskId];
      if (tasksToDelete.length < MAX_FOR_DELETE) {
        //update ui
        setDeletedTasks(tasksToDelete);
        setPendingTaskList((prev) => prev.filter((task) => task._id !== taskId));
        alert('Task removed successfully', taskId);
        return;
      }


      //fetch after the bucket is full
      const response = await fetch(`${Server_path}/api/tasks/delete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({userEmail, deletedTasks })
      });

      if (response.ok) {
        setDeletedTasks([]);
      }
      else {
        alert('Failed to remove task:', response.status);
      }




    } catch (error) {
      console.error('Error removing task:', error);
    }
  };

  async function completeTask(taskId) {
    try {
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

  const MainContextValues = {
    isLoading, setIsLoading, setAuthenticated, authenticated, setUserName, userName, userId,
    setUserId, userEmail, setUserEmail, capitalizeFirstLetter, setCompletedTaskList,
    setPendingTaskList, pendingTaskList, completedTaskList, allTasks, setAllTasks, userImage,
    setUserImage, deleteTask, completeTask, handleOnCancel, handleEdit, selectedTask, handleEditTask,
    isEditModalVisible, getTodayTasks, getCurrentWeekTasks
  }

  return (
    <MainContext.Provider value={MainContextValues}>
      {children}
    </MainContext.Provider>
  )
}
export default MainContextProvider;



