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
  const [pendingTaskList, setPendingTaskList] = useState([]);// pending task list after modified in server 
  const [completedTaskList, setCompletedTaskList] = useState([]); // completed task list after modified in server 
  const [deletedTasksList, setDeletedTasks] = useState([]); //deleted task list after modifed in server
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
  const [deletedTask, setDeletedTask] = useState(null);

  //Const 
  const MAX_FOR_DELETE = 20;
  const MAX_FOR_COMPLETE = 20;
  const MAX_FOR_ADD = 20;

  async function syncAppStorageWithDataBaseData() {

    setPendingTaskList([]);
    setCompletedTaskList([]);
    setDeletedTasks([]);
    setTasksToComplete([]);
    setTasksToDelete([]);

    const updatedData = await loadAllTasks();
    setPendingTaskList(updatedData.filter(task => task.status === 'pending'));
    setCompletedTaskList(updatedData.filter(task => task.status === 'completed'));
    setDeletedTasks(updatedData.filter(task => task.status === 'deleted'));
    // ... Update other state variables

    await AsyncStorage.setItem('pendingTasks', JSON.stringify(pendingTaskList));
    await AsyncStorage.setItem('completedTasks', JSON.stringify(completedTaskList));
    await AsyncStorage.setItem('deletedTasks', JSON.stringify(deletedTasksList));
  }



// useEffect(() => {
//   async function syncDataWithServer(){
//     if()
//   }

  
// }, [third])


  // useEffect(() => {
  //   async function saveDeletedTasksToStorage() {
  //     try {
  //       await AsyncStorage.setItem('deletedTasks', JSON.stringify(deletedTasksList));
  //     } catch (error) {
  //       console.error('Error saving deleted tasks to AsyncStorage:', error);
  //     }
  //   }

  //   saveDeletedTasksToStorage();
  // }, [deletedTasksList]);

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
      const taskToDelete = pendingTaskList.find(task => task._id === taskId);

      // Update UI and state
      setDeletedTask(taskToDelete);
      setTasksToDelete(prev => [...prev, taskId]);

      // Remove the task from pendingTaskList
      setPendingTaskList(prev => prev.filter(task => task._id !== taskId));

      // Update local storage
      const updatedDeletedTasks = [...deletedTasksList, taskToDelete];
      await AsyncStorage.setItem('deletedTasks', JSON.stringify(updatedDeletedTasks));
      const updatedPendingTasks = pendingTaskList.filter(task => task._id !== taskId);
      await AsyncStorage.setItem('pendingTasks', JSON.stringify(updatedPendingTasks));

      // Show the undo message
      setShowUndoMessage(true);
      setUndoAction('delete');
      setUndoTaskData(taskToDelete);

      // Check if batch limit reached
      if (tasksToDelete.length >= MAX_FOR_DELETE) {
        await performDeleteRequest(tasksToDelete);
        return;
      }

      if (tasksToAdd.includes(taskId)) {
        setTasksToAdd(prev => prev.filter(id => id !== taskId));
      } else {
        setTasksToDelete(prev => [...prev, taskId]);
      }

      // Update UI
      setDeletedTasks(prev => [...prev, taskId]);
    } catch (error) {
      handleDeleteError(error);
    }
  }

  async function performDeleteRequest(taskIds) {
    try {
      const response = await fetch(`${Server_path}/api/tasks/delete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userEmail, deletedTasks: taskIds })
      });

      if (response.ok) {
        setDeletedTasks(prev => [...prev, ...taskIds]);
        setTasksToDelete([]); // Clear tasksToDelete state
      } else {
        console.error('Error removing task:', response.status);
      }
    } catch (error) {
      console.error('Error removing task:', error);
    }
  }

  function handleDeleteError(error) {

    // Add user-friendly error handling and feedback here
  };


  // async function deleteTask(taskId) {
  //   try {
  //     //handle UI
  //     const taskToDelete = pendingTaskList.filter((task) => task._id === taskId); // hold the opbject of the releted id
  //     setDeletedTask(taskToDelete);// updated the state if this object for use in other methods
  //     setTasksToDelete(prev => [...prev, taskId])
  //     setPendingTaskList((prev) => prev.filter((task) => task._id !== taskId)); // update pending list becuase this is the list im rendering , if its not there it wont be displayed.
  //     // Update local storage with the new pending task list
  //     const updatedDeletedTasks = [...deletedTasksList, deletedTask];
  //     await AsyncStorage.setItem('deletedTasks', JSON.stringify(updatedDeletedTasks));
  //     await AsyncStorage.setItem('pendingTasks', JSON.stringify(pendingTaskList));
  //     console.log(AsyncStorage.getItem('deletedTasks'));
  //     // Logic to determine whether to remove task from server or mark it for deletion


  //     // Show the undo message
  //     setShowUndoMessage(true);
  //     setUndoAction('delete');
  //     setUndoTaskData(taskToDelete);

  //     if (tasksToDelete.length >= MAX_FOR_DELETE) {
  //       // fetch after the bucket is full
  //       const response = await fetch(`${Server_path}/api/tasks/delete`, {
  //         method: 'PUT',
  //         headers: {
  //           'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify({ userEmail, deletedTasks: tasksToDelete })
  //       });
  //       if (response.ok) {
  //         setDeletedTasks((prev) => [...prev, deletedTask]) // update the list of the tasks with status "removed"
  //         setTasksToDelete([]); // Clear tasksToDelete state
  //       }
  //       else {
  //         alert('Failed to remove task:', response.status);
  //       }
  //       return;
  //     }

  //     if (tasksToAdd.includes(taskId)) {
  //       // If the task is in the tasksToAdd list, it means the task was added but not yet sent to the server.
  //       // In this case, we should remove it from the tasksToAdd list.
  //       setTasksToAdd((prev) => prev.filter((id) => id !== taskId));
  //     } else {
  //       // If the task is not in tasksToAdd, it means the task has already been sent to the server.
  //       // In this case, we mark the task for deletion by adding its ID to the tasksToDelete list.
  //       setTasksToDelete((prev) => [...prev, taskId]);
  //     }


  //     //update ui
  //     setDeletedTasks((prev) => [...prev, taskId]);
  //     // alert('Task removed successfully', taskId);
  //   }

  //   catch (error) {
  //     console.error('Error removing task:', error);
  //   }
  // };


  async function completeTask(taskId) {
    try {
      const taskToComplete = pendingTaskList.find(task => task._id === taskId);

      // Save the completed task object using the taskId
      const currCompletedTask = pendingTaskList.find(task => task._id === taskId);

      // Add the taskId to tasksToComplete and check batch size
      setTasksToComplete(prev => [...prev, taskId]);

      // Remove the completed task from the pending list
      setPendingTaskList(prev => prev.filter(task => task._id !== taskId));

      // Show the undo message
      setShowUndoMessage(true);
      setUndoAction('complete');
      setUndoTaskData(taskToComplete);

      // Update completedTaskList with the current completed task
      setCompletedTaskList(prev => [...prev, currCompletedTask]);

      // Update local storage with the new completed tasks
      const updatedCompletedTasks = [...completedTaskList, currCompletedTask];
      await AsyncStorage.setItem('completedTasks', JSON.stringify(updatedCompletedTasks));
      await AsyncStorage.setItem('pendingTasks', JSON.stringify(pendingTaskList));
      storeLocalTasks();

      if (tasksToComplete.length >= MAX_FOR_COMPLETE) {
        const response = await fetch(`${Server_path}/api/tasks/completeTask`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userEmail, completedTasks: tasksToComplete }),
        });

        if (response.ok) {
          // Clear tasksToComplete state
          setTasksToComplete([]);
          console.log('Tasks completed successfully');
        } else {
          alert('Failed to complete task:', response.status);
        }
        return;
      }

      if (tasksToComplete.includes(taskId)) {
        // Task is in tasksToAdd, so remove it from the list
        setTasksToAdd(prev => prev.filter(id => id !== taskId));
      }

      //update ui
      // alert('Task removed successfully', taskId);
    } catch (error) {
      console.error('Error completing task:', error);
    }
  }



  async function addTask(taskObj) {
    try {
      // Update the UI state immediately
      setPendingTaskList(prev => [...prev, taskObj]);
      setTasksToAdd((prev) => [...prev, taskObj]);

      //Update local storage with new task
      const updatedPendingTasks = [...pendingTaskList, taskObj];
      await AsyncStorage.setItem('pendingTasks', JSON.stringify(updatedPendingTasks))

      // Check if the batch size has reached the threshold
      if (tasksToAdd.length + 1 >= MAX_FOR_ADD) { // +1 because we're adding a new task
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
          console.log('Failed to create task:', response.status, response.statusText);
        }

        setPendingTaskList(updatedPendingTasks)


      }
      console.log('addTask +>', taskObj);
      console.log('tasksToAdd ', tasksToAdd.length + 1);
      console.log('tasksToAdd ', tasksToAdd.concat(taskObj));

      console.log('tasksToAdd ', tasksToAdd.length);
      console.log('tasksToAdd ', tasksToAdd);


    } catch (error) {
      console.log('Failed to create task:', error);

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
      if (response.status.ok) {
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

  // const updatePendingTaskHandler = async (taskId) => {
  //   try {
  //     // Filter out the task to be removed
  //     const updatedPendingTasks = pendingTaskList.filter(task => task._id !== taskId);

  //     // Update the local storage with the new task list
  //     await AsyncStorage.setItem('pendingTasks', JSON.stringify(updatedPendingTasks));

  //     // Update the state to reflect the removed task
  //     setPendingTaskList(updatedPendingTasks);
  //   } catch (error) {
  //     console.error('Error removing task:', error);
  //   }
  // };

  const undoDelete = (taskToUndo) => {
    // Logic to add the deleted task back to the task list
    setDeletedTasks(prevDeletedTasks => prevDeletedTasks.filter(task => task._id !== taskToUndo._id));
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
    setPendingTaskList, pendingTaskList, completedTaskList, allTasks, setAllTasks, userImage,
    setUserImage, deleteTask, completeTask, handleOnCancel, handleEdit, selectedTask, handleEditTask,
    isEditModalVisible, getTodayTasks, getCurrentWeekTasks, loadTasks, storeLocalTasks, loadLocalTasks, addTask,
    showUndoMessage, undoAction, undoTaskData, undoComplete, undoDelete, 

  }

  return (
    <MainContext.Provider value={MainContextValues}>
      {children}
    </MainContext.Provider>
  )
}
export default MainContextProvider;



