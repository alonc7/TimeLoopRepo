/**
 * TasksScreen Component
 *
 * This component represents the main screen of the application where users can view, add, and manage their tasks.
 *
 * It includes features like task input modal, sorting, searching, and animations.
 *
 * @component
 * @example
 * // Example Usage:
 * import TasksScreen from './TasksScreen';
 * // ...
 * <TasksScreen />
 *
 * @returns {JSX.Element} A React component that displays the TasksScreen.
 */
import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Import necessary components and libraries
import { FloatingAction } from "react-native-floating-action";
import { AntDesign } from '@expo/vector-icons';
import TaskInput from '../Components/Modals/TaskInput';
import GoalItem from '../Components/GoalItem';
import COLORS from '../constants/colors';
import { MainContext } from '../Components/Context/MainContextProvider';
import FloatingActionBtn from '../Components/Modals/FloatingActionBtn'
import SearchBar from '../Components/SearchBar';
import UndoMessage from '../Components/UndoMessage';
import LottieView from 'lottie-react-native';

/**
 * The TasksScreen functional component.
 *
 * @returns {JSX.Element} The rendered JSX element.
 */
const TasksScreen = () => {
  // State variables for controlling modals, search, and selected days
  const [modalIsVisible, setModalIsVisible] = useState(false); // taskInput modal
  const [isHidden, setIsHidden] = useState(true);
  const { userEmail, pendingTaskList, setPendingTaskList, addTask, handleEditTask, showUndoMessage } = useContext(MainContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [animationSource, setAnimationSource] = useState(null);

  const [showLocalUndoMessage, setShowLocalUndoMessage] = useState(false);


  useEffect(() => {
    const randomAnim = getRandomAnim(); // Call getRandomAnim when the component mounts
    setAnimationSource(randomAnim);
  }, []);

  /**
   * Play a random animation.
   */
  const playRandomAnimation = () => {
    const randomAnimation = getRandomAnim();
    setAnimationSource(randomAnimation);
  };
  const toggleLocalUndoMessage = () => {
    if (showLocalUndoMessage)
      setShowLocalUndoMessage(false);
    else
      setShowLocalUndoMessage(true);

  };
  // Function to toggle the modal's visibility
  function toggleBtn() {
    setIsHidden(!isHidden);
  }

  // Function to handle modal visibility
  function handleModalIsVisible() {
    setModalIsVisible(!modalIsVisible);
  }

  // Create a mapping to store temporary IDs and their corresponding MongoDB IDs
  const idMapping = new Map();

  /**
   * Generate a temporary ID.
   *
   * @returns {string} The generated temporary ID.
   */
  function generateTempId() {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 10000);
    const tempId = `${timestamp}_${random}`;
    // Store the temporary ID in the mapping
    idMapping.set(tempId, null); // Initialize with no MongoDB ID
    return tempId;
  }

  /**
   * Add a new task.
   *
   * @param {string} title - The title of the task.
   * @param {string} description - The description of the task.
   * @param {string} startDate - The start date of the task.
   * @param {string} dueDate - The due date of the task.
   * @param {string} startTime - The start time of the task.
   * @param {string} dueTime - The due time of the task.
   * @param {string} priority - The priority of the task.
   * @param {boolean} isRepeat - Indicates if the task is a repeat task.
   * @param {string} repeatOption - The repeat option for the task.
   * @param {Array<string>} selectedDays - The selected days for repeating tasks.
   * @param {string} repeatSelectedTime - The selected time for repeating tasks.
   */
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

  // Actions for the FloatingAction component
  const taskActions = [
    {
      text: 'Scheduled Task',
      icon: <AntDesign name="pluscircleo" size={34} color="white" />,
      name: 'add_task',
      position: 1,
    },
  ];

  const animArray = [
    //שוויון מגדרי 
    require('.././assets/Lottie/FreeTime(1)-male.json'),
    require('.././assets/Lottie/FreeTime(2)-female.json'),
  ];

  /**
   * Get a random animation from the animation array.
   *
   * @returns {Object|null} A random animation source object or null if the array is empty.
   */
  function getRandomAnim() {
    if (animArray.length > 0) {
      const randomIndex = Math.floor(Math.random() * animArray.length);
      const randomAnimation = animArray[randomIndex];
      return randomAnimation;
    } else {
      console.error('animArray is empty or undefined.');
      return null;
    }
  }
  const showLocalUndoMessageInParent = () => {
    toggleLocalUndoMessage()
  };

  // Render the component
  return (
    <LinearGradient
      style={styles.container}
      colors={[COLORS.secondary, COLORS.primary]}
    >
      {/* Search bar */}
      <SearchBar value={searchQuery} onChangeText={(text) => setSearchQuery(text)} />
      <View style={styles.container}>
        {modalIsVisible && (
          <View>
            {/* TaskInput modal */}
            <TaskInput
              visible={modalIsVisible}
              onAddTask={addTaskHandler}
              onClose={handleModalIsVisible}
              toggleBtn={toggleBtn}
              setTasks={setPendingTaskList}
              selectedDays={selectedDays} // Pass selectedDays as a prop
            />
          </View>
        )}
        <View>
          <FlatList
            contentContainerStyle={{ justifyContent: 'center' }}
            data={pendingTaskList.filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase()))}
            renderItem={({ item }) => (
              // Render each task item using GoalItem component
              <GoalItem
                text={item.title}
                description={item?.description}
                startDate={item?.startDate}
                endDate={item?.dueDate}
                task_id={item._id}
                startHour={item?.startTime}
                endHour={item?.dueTime}
                priority={item?.priority}
                onSave={(editedTask) => {
                  handleEditTask(userEmail, editedTask); // Implement the onSave logic here
                  // setIsEditModalVisible(false); // Hide the EditTaskModal
                }}
              />
              // <GoalItem
              //   text={item.title}
              //   description={item?.description}
              //   startDate={item?.startDate}
              //   endDate={item?.dueDate}
              //   task_id={item._id}
              //   startHour={item?.startTime}
              //   endHour={item?.dueTime}
              //   priority={item?.priority}
              //   onSave={(editedTask) => {
              //     handleEditTask(userEmail, editedTask);
              //   }}
              //   showLocalUndoMessageInParent={showLocalUndoMessageInParent} // Call the callback function in the child component
              // />

            )}
            keyExtractor={(item, index) => item._id || index.toString()} // Use _id if available, fallback to index
            alwaysBounceVertical={false}
          />
          {/* Floating action button */}
          {pendingTaskList.length === 0 && !modalIsVisible ? (
            <LottieView
              style={{ height: '65%', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}
              source={getRandomAnim()}
              autoPlay
              loop
            />
          ) : null}

          <FloatingActionBtn />
          <FloatingAction
            color={COLORS.secondary}
            position={'left'}
            buttonSize={34}
            overrideWithAction={true}
            showBackground={false}
            actions={taskActions}
            onPressItem={handleModalIsVisible}
          />
          {(/*showLocalUndoMessage &&*/ showUndoMessage) && <UndoMessage />}
        </View>
      </View>
    </LinearGradient>
  );
};

// Styles for the component
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
