import React, { createContext, useEffect, useState, useRef } from 'react'
import { Server_path } from '../../utils/api-url';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';

export const MainContext = createContext()

function MainContextProvider({ children }) {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const [authenticated, setAuthenticated] = useState(false)
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [allTasks, setAllTasks] = useState([]);
  const [pendingTaskList, setPendingTaskList] = useState([]);// pending task list after modified in server 
  const [completedTaskList, setCompletedTaskList] = useState([]); // completed task list after modified in server 
  const [deletedTasksList, setDeletedTasksList] = useState([]); //deleted task list after modifed in server
  const [userImage, setUserImage] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // State to manage the visibility of EditTaskModal
  const [selectedTask, setSelectedTask] = useState(null); // State to hold the selected task for editing
  const [tasksToDelete, setTasksToDelete] = useState([]) // list of tasks to modifiy in the server as deleted
  const [tasksToComplete, setTasksToComplete] = useState([]) //list of tasks to modifiy in the server as completed 
  const [tasksToAdd, setTasksToAdd] = useState([])// list of tasks to add as a bulk in the server
  const [showUndoMessage, setShowUndoMessage] = useState(false);
  const [undoAction, setUndoAction] = useState('');
  const [undoTaskData, setUndoTaskData] = useState(false);
  const [completedTask, setCompletedTask] = useState(null);
  const [isListenerActive, setIsListenerActive] = useState(true);




  //Const 
  const MAX_FOR_DELETE = 20;
  const MAX_FOR_COMPLETE = 20;
  const MAX_FOR_ADD = 20;


  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
        // Only send requests when transitioning from 'active' to 'inactive' or 'background'
        if (tasksToDelete.length > 0)
          await performDeleteRequest(tasksToDelete);
        if (tasksToComplete.length > 0)
          await performCompleteRequest(tasksToComplete);
        if (tasksToAdd.length > 0)
          await performAddRequest(tasksToAdd);
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);

    });
    return () => {
      subscription.remove();
    }
  }, [appStateVisible, tasksToDelete, tasksToComplete, tasksToAdd]);

  useEffect(() => {
    if (tasksToDelete.length >= MAX_FOR_DELETE) {
      console.log(tasksToDelete.length);
      performDeleteRequest(tasksToDelete);
    }
    if (tasksToComplete.length >= MAX_FOR_COMPLETE) {
      console.log(tasksToComplete.length);
      performCompleteRequest(tasksToComplete);
    }
    if (tasksToAdd.length >= MAX_FOR_ADD) {
      console.log(tasksToAdd.length);
      performAddRequest(tasksToAdd);
    }

  }, [tasksToDelete, tasksToComplete, tasksToAdd])



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
    // Calculate the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const dayOfWeek = new Date().getDay();

    // Calculate the start and end dates of the current week
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek); // Set to the beginning of the week (Sunday)
    const startDate = startOfWeek.toISOString().split('T')[0].replace(/-/g, '/');

    const endOfWeek = `${new Date().getFullYear()}/${new Date().getDate() + (6 - dayOfWeek)}/${(new Date().getMonth() + 1).toString().padStart(2, '0')}`;


    // Iterate through tasks and check if the start date is within the current week
    const tasksForThisWeek = pendingTaskList.filter(task => {
      const taskStartDate = task.startDate;
      return taskStartDate >= startDate && taskStartDate <= endOfWeek;
    });

    if (tasksForThisWeek.length > 0) {
      return tasksForThisWeek;
    } else {
      return [];
    }
  };


  const getTodayTasks = () => {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '/');
    return tasksOfToday = pendingTaskList.filter(task => task.startDate === today);

  };
  //End of HomeScreen methods

  //Login and register 
  const Login = async (email, password) => {
    try {
      const response = await fetch(`${Server_path}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        const userData = {
          id: data.user.id,
          token: data.user.token,
          name: data.user.firstName,
          email: data.user.email,
        };
        storeUserData(userData);
        setAuthenticated(true);
        navigation.navigate('Main')
      } else {
        // Handle non-OK responses
        const errorData = await response.json();
        if (errorData && errorData.message) {
          window.alert('Error: ' + errorData.message);
        } else {
          window.alert('An error occurred while logging in.');
        }
      }
    } catch (error) {

    }
  };

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

  /**
  * Deletes a task from the pending task list and sends a request to delete it on the server.
  * @param {string} taskId - The unique identifier of the task to delete.
  */
  async function deleteTask(taskId) {
    try {
      // Find the task to delete
      const taskToDelete = pendingTaskList.find(task => task._id === taskId);

      // Add the task to the list of tasks to delete
      addToTasksToDelete(taskId);


      // Show an undo message
      setShowUndoMessage(true);
      setUndoAction('delete');
      setUndoTaskData(taskToDelete);

      // Update the list of tasks to delete
      setDeletedTasksList(prev => [...prev, taskToDelete]);
      // Check if the batch limit for deletion is reached
      if (tasksToDelete.length >= MAX_FOR_DELETE) {
        await performDeleteRequest(tasksToDelete);
        return;
      }
    } catch (error) {
      console.error('Error in deleteTask:', error);
    }
  }

  /**
   * Sends a request to the server to perform a batch delete of tasks.
   */
  async function performDeleteRequest() {
    try {
      const response = await fetch(`${Server_path}/api/tasks/delete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userEmail, deletedTasks: tasksToDelete })
      });

      if (response.ok) {
        // Clear the tasksToDelete state
        setTasksToDelete([]);
      } else {
        console.error('Error removing tasks:', response.status);
      }
    } catch (error) {
      console.error('Error removing tasks:', error);
    }
  };

  /**
  * Adds a task to the list of tasks to delete.
  * Removes the task from the pendingTaskList.
  * @param {string} taskId - The unique identifier of the task to delete.
  */
  const addToTasksToDelete = (taskId) => {
    setTasksToDelete(prevTasks => [...prevTasks, taskId]);
    // Remove the task from pendingTaskList
    setPendingTaskList(prev => prev.filter(task => task._id !== taskId));
  };

  /**
   * Adds a task to the list of tasks to complete and initiates a completion action.
   * @param {string} taskId - The unique identifier of the task to complete.
   */
  async function completeTask(taskId) {
    try {
      // Find the task to complete
      const taskToComplete = pendingTaskList.find(task => task._id === taskId);

      // Add the task to the list of tasks to complete
      addToTasksToComplete(taskId);

      // Show an undo message
      setShowUndoMessage(true);
      setUndoAction('complete');
      setUndoTaskData(taskToComplete);

      // Update the completedTaskList with the current completed task
      setCompletedTaskList(prev => [...prev, taskToComplete]);

      // Check if the batch limit for completion is reached
      if (tasksToComplete.length >= MAX_FOR_COMPLETE) {
        await performCompleteRequest();
        return;
      }
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  /**
   * Sends a request to the server to perform a batch completion of tasks.
   */
  async function performCompleteRequest() {
    try {
      const response = await fetch(`${Server_path}/api/tasks/completeTask`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail, completedTasks: tasksToComplete }),
      });

      if (response.ok) {
        // Clear the tasksToComplete state
        setTasksToComplete([]);
      } else {
        console.error('Failed to complete tasks:', response.status);
      }
      return;
    }
    catch (error) {
      console.error('Error completing tasks:', error);
    }
  };

  /**
   * Adds a task to the list of tasks to complete.
   * Removes the task from the pendingTaskList.
   * @param {string} taskId - The unique identifier of the task to complete.
   */
  const addToTasksToComplete = (taskId) => {
    setTasksToComplete(prevTasks => [...prevTasks, taskId]);
    // Remove the task from pendingTaskList
    setPendingTaskList(prev => prev.filter(task => task._id !== taskId));
  };

  /**
   * Adds a new task to the list of tasks to add and sends a request to the server when the batch size threshold is reached.
   * @param {object} taskObj - The task object to add.
   */
  async function addTask(taskObj) {
    try {
      // Update the UI state immediately
      setTasksToAdd(prev => [...prev, taskObj]);
      setPendingTaskList(prev => [...prev, taskObj]);

      // Check if the batch size has reached the threshold
      if (tasksToAdd.length >= MAX_FOR_ADD) {
        await performAddRequest([...tasksToAdd, taskObj]);
        setTasksToAdd([]);
      }

      console.log('tasksToAdd ', tasksToAdd.length);
    } catch (error) {
      console.log('Failed to create task:', error, tasksToAdd);
    }
  }

  /**
   * Sends a request to the server to add a batch of tasks.
   * @param {array} tasksToAdd - An array of task objects to add.
   */
  async function performAddRequest(tasksToAdd) {
    if (tasksToAdd.length > 0) {
      try {
        // Send the tasks to the server
        const response = await fetch(`${Server_path}/api/tasks/addTasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userEmail, tasksToAdd })
        });

        if (response.ok) {
          // Clear the tasksToAdd state
          setTasksToAdd([]);
        } else {
          console.log('Failed to create tasks:', response.status, response.statusText, tasksToAdd);
        }
      } catch (error) {
        console.error('Error adding tasks:', error)
      }
    }
  };

  const handleEditTask = (userEmail, updatedTask) => {
    // Update the task locally in the pendingTaskList first
    const updatedTaskId = updatedTask._id;
    setPendingTaskList((prevTasks) =>
      prevTasks.map((task) =>
        task._id === updatedTaskId ? updatedTask : task
      )
    );
    // Check if the edited task is already in tasksToAdd
    const isTaskInTasksToAdd = tasksToAdd.some((task) => task._id === updatedTaskId);
    if (isTaskInTasksToAdd) {
      // Update the existing task within tasksToAdd
      setTasksToAdd((prevTasksToAdd) =>
        prevTasksToAdd.map((task) =>
          task._id === updatedTaskId ? updatedTask : task
        )
      );
    } else {
      // Send the API request to update the task in the database
      performEditRequest(userEmail, updatedTask);
    }

    setIsEditModalVisible(false); // Hide the EditTaskModal
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

  /**
 * Function to mark a task as incomplete
 * @param {object} unCompleteTask - The task to be marked as incomplete
 */
  async function unComplete(unCompleteTask) {
    console.log('unComplete');
    // Store the ID of the task to be marked as incomplete
    const unCompleteTaskId = unCompleteTask._id;


    // setTasksToAdd((prevList) => [...prevList, unCompleteTask])
    setPendingTaskList((prevList) => [...prevList, unCompleteTask])

    // Check if the edited task is already in tasksToComplete or tasksToDelete
    const isTaskInTaskToComplete = tasksToComplete.some((task) => task._id === unCompleteTaskId);
    // const isTaskInTaskToDelete = tasksToDelete.some((task) => task._id === unCompleteTaskId);

    // Update the task locally in the pendingTaskList first
    setCompletedTaskList((prevList) => prevList.filter((task) => task._id !== unCompleteTaskId))
    // setDeletedTasksList((prevList) => prevList.filter((task) => task._id !== unCompleteTaskId))

    if (isTaskInTaskToComplete) {
      console.log(isTaskInTaskToComplete);
      // Update the existing task within tasksToComplete
      setTasksToComplete((prevTasksToComplete) =>
        prevTasksToComplete.map((task) =>
          task._id === unCompleteTaskId ? updatedTask : task
        )
      );
    }
    // else if (isTaskInTaskToDelete) {
    //   console.log(isTaskInTaskToDelete);

    //   // Update the existing task within tasksToDelete
    //   setTasksToDelete((prevTasksToDelete) =>
    //     prevTasksToDelete.map((task) =>
    //       task._id === unCompleteTaskId ? updatedTask : task
    //     )
    //   );
    // }
    else {
      // Send the API request to update the task in the database
      await performPendTask(unCompleteTaskId);
    }
  }
  async function unDelete(unDeleteTask) {
    console.log('unDelete');
    // Store the ID of the task to be marked as incomplete
    const unDeleteTaskId = unDeleteTask._id;


    // setTasksToAdd((prevList) => [...prevList, unDeleteTask])
    setPendingTaskList((prevList) => [...prevList, unDeleteTask])

    // Check if the edited task is already in tasksToComplete or tasksToDelete
    const isTaskInTaskToDelete = tasksToDelete.some((task) => task._id === unDeleteTaskId);

    // Update the task locally in the pendingTaskList first
    setDeletedTasksList((prevList) => prevList.filter((task) => task._id !== unDeleteTaskId))


    if (isTaskInTaskToDelete) {
      // Update the existing task within tasksToDelete
      setTasksToDelete((prevTasksToDelete) =>
        prevTasksToDelete.map((task) =>
          task._id === unDeleteTaskId ? updatedTask : task
        )
      );
    } else {
      // Send the API request to update the task in the database
      await performPendTask(unDeleteTaskId);
    }
  }

  /**
   * Function to perform the actual pending action by making an API request
   * @param {string} updatedTaskId - The ID of the task to be marked as incomplete
   */
  const performPendTask = async (updatedTaskId) => {
    try {
      console.log('performPendTask is executed', updatedTaskId);
      // Make a PUT request to the server to mark the task as pending
      const response = await fetch(`${Server_path}/api/tasks/pendTask`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail, updatedTaskId }),
      });

      if (!response.ok) {
        console.error('Failed to mark the task as pending:', response.status);
      }
    } catch (error) {
      console.error('An error occurred while marking the task as pending:', error);
    }
  };
  // Define a function to determine the task list type
  function getTaskListType(selectedTask, pendingTaskList, completedTaskList, deletedTaskList) {
    if (selectedTask === pendingTaskList) {
      return "Pending Tasks";
    } else if (selectedTask === completedTaskList) {
      return "Completed Tasks";
    } else if (selectedTask === deletedTaskList) {
      return "Deleted Tasks";
    } else {
      // Handle any other cases or return a default value
      return "Unknown";
    }
  }

  // const handleEditTask = async (userEmail, updatedTask) => {
  //   try {
  //     // Update the task locally in the pendingTaskList first
  //     const updatedTaskId = updatedTask._id;
  //     setPendingTaskList((prevTasks) =>
  //       prevTasks.map((task) =>
  //         task._id === updatedTaskId ? updatedTask : task
  //       )
  //     );

  //     const response = await axios.put(`${Server_path}/api/tasks/editTask`, {
  //       userEmail,
  //       updatedTask
  //     });
  //     if (response.status.ok) {
  //       setIsEditModalVisible(false); // Hide the EditTaskModal
  //       alert('Task updated successfully');
  //     } else {
  //       alert('Something went wrong with task updating');
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     alert('Something went wrong with task updating');
  //   }
  // };
  const performEditRequest = async (userEmail, updatedTask) => {
    try {

      const response = await axios.put(`${Server_path}/api/tasks/editTask`, {
        userEmail,
        updatedTask
      });
      if (response.status.ok) {
        setIsEditModalVisible(false); // Hide the EditTaskModal
        alert('Task updated successfully');
      } else {
        alert('Something went wrong with task updating');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong with task updating', error);
    }
  };
  const loadTasks = async (userEmail) => {
    try {
      const [pendingResponse, completedResponse, allTasksResponse, deletedResponse] = await Promise.all([
        fetch(`${Server_path}/api/tasks/getPendingTaskList/${userEmail}`),
        fetch(`${Server_path}/api/tasks/getCompletedTaskList/${userEmail}`),
        fetch(`${Server_path}/api/tasks/allTasks/${userEmail}`),
        fetch(`${Server_path}/api/tasks/getRemovedTaskList/${userEmail}`)
      ]);

      if (pendingResponse.ok && completedResponse.ok && allTasksResponse.ok && deletedResponse.ok) {
        const pendingData = await pendingResponse.json();
        const completedData = await completedResponse.json();
        const allData = await allTasksResponse.json();
        const deletedData = await deletedResponse.json();

        // Update local tasks
        setPendingTaskList(pendingData);
        setCompletedTaskList(completedData);
        setAllTasks(allData);
        setDeletedTasksList(deletedData);
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

  const undoDelete = (taskToUndo) => {
    // Logic to add the deleted task back to the task list
    setDeletedTasksList(prevDeletedTasks => prevDeletedTasks.filter(task => task._id !== taskToUndo._id));
    setPendingTaskList(prevPendingTasks => [...prevPendingTasks, taskToUndo]);

    // Clear the undo state
    setShowUndoMessage(false);
    setUndoAction('');
    setUndoTaskData(null);
  };

  const undoComplete = (taskToUndo) => {
    // Logic to mark the completed task as not completed
    setCompletedTaskList(prevCompletedTasks => prevCompletedTasks.filter(task => task._id !== taskToUndo._id));
    setPendingTaskList(prevPendingTasks => [...prevPendingTasks, taskToUndo]);
    // Clear the undo state
    setShowUndoMessage(false);
    setUndoAction('');
    setUndoTaskData(null);
  };

  const MainContextValues = {
    isLoading, setIsLoading, setAuthenticated, authenticated, setUserName, userName, userId,
    setUserId, userEmail, setUserEmail, capitalizeFirstLetter, setCompletedTaskList,
    setPendingTaskList, pendingTaskList, deletedTasksList, completedTaskList, allTasks, setAllTasks, userImage,
    setUserImage, deleteTask, completeTask, handleOnCancel, handleEdit, selectedTask, handleEditTask,
    isEditModalVisible, getTodayTasks, getCurrentWeekTasks, loadTasks, addTask,
    showUndoMessage, undoAction, undoTaskData, undoComplete, undoDelete, setShowUndoMessage, unComplete, unDelete, getTaskListType

    // storeLocalTasks, loadLocalTasks

  }

  return (
    <MainContext.Provider value={MainContextValues}>
      {children}
    </MainContext.Provider>
  )
}
export default MainContextProvider;



