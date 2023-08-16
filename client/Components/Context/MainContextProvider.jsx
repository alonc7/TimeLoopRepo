import React, { createContext, useState } from 'react'
import { Server_path } from '../../utils/api-url';

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
      const response = await fetch(`${Server_path}/api/tasks/removeTask`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail, taskId }),
      });
      if (response.ok) {
        // setPendingTaskList(pendingTaskList.filter((item) => item._id !== taskId))
        console.log('Task removed successfully', taskId);
        console.table()

      } else {
        console.log('Failed to remove task:', response.status);
      }
    } catch (error) {
      console.error('Error removing task:', error);
    }
  };

  // Function to mark the task as completed using API request
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
        console.log('Task completed successfully');
      } else {
        console.log(response);
        console.log('Failed to complete task:', response.status);
      }
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };


  const MainContextValues = {
    isLoading,
    setIsLoading,
    setAuthenticated,
    authenticated,
    setUserName,
    userName,
    userId,
    setUserId,
    userEmail,
    setUserEmail,
    capitalizeFirstLetter,
    setCompletedTaskList,
    setPendingTaskList,
    pendingTaskList,
    completedTaskList,
    allTasks,
    setAllTasks,
    userImage,
    setUserImage,
    deleteTask,
    completeTask
  }
  return (
    <MainContext.Provider value={MainContextValues}>
      {children}
    </MainContext.Provider>
  )
}
export default MainContextProvider;



