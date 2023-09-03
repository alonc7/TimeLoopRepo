import React, { useRef, useState, useContext } from 'react';
import { StyleSheet, View, Text, Pressable, SafeAreaView, Animated, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import { MainContext } from '../Components/Context/MainContextProvider';
import { Server_path } from '../utils/api-url';
import { LinearGradient } from 'expo-linear-gradient';
import EditTaskModal from './Modals/EditTaskModal';

// import AnimatedText from 'react-native-paper/lib/typescript/src/components/Typography/AnimatedText';

function GoalItem(props) {
  const { task_id, text, description, startDate, endDate, startHour, endHour } = props;
  const [completed, setCompleted] = useState(false);
  const { userEmail, setPendingTaskList, completeTask, deleteTask, handleOnCancel, handleEdit, selectedTask, handleEditTask, isEditModalVisible } = useContext(MainContext);

  const lineThroughAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  function handleDeleteItem() {
    deleteTask(task_id);
  };

  // Function to handle the completion toggle
  function toggleCompletion() {
    setCompleted(!completed);
    if (!completed) {
      Animated.sequence([
        Animated.timing(lineThroughAnim, {
          toValue: 100,
          duration: 0,
          useNativeDriver: false,
        }),
        Animated.timing(opacityAnim, {
          toValue: 100,
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start(() => {
        completeTask(task_id); // Call the API function with the task ID (props.id)
      });
    } else {
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(lineThroughAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };




  let borderColor;
  switch (props.priority) {
    case 'high':
      borderColor = '#e100ff';
      // borderColor = COLORS.red;
      break;
    case 'medium':
      borderColor = 'orange';
      break;
    case 'low':
      borderColor = 'grey';
      break;
    default:
      borderColor = COLORS.grey
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.goalItem, { borderColor, elevation: 0, opacity: opacityAnim }]}>
        <LinearGradient style={styles.LinerGradientContainer} colors={[COLORS.secondary, COLORS.primary]}>
          <View style={styles.header}>
            <Animated.Text style={[styles.taskText, { textDecorationLine: completed ? 'line-through' : 'none' }]}>
              {text}
            </Animated.Text>
          </View>
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>{description}</Text>
          </View>
          <View style={styles.dateTimeContainer}>
            <View style={styles.dateTimeTextContainer}>
              <Ionicons name="md-calendar" size={18} color={COLORS.white} />
              <Text style={styles.dateTimeText}>{startDate ? startDate : 'No Start Date'}</Text>
              <Text style={styles.dateTimeText}>{endDate ? endDate : 'No End Date'}</Text>
            </View>
            <View style={styles.dateTimeTextContainer}>
              <Ionicons name="md-time" size={18} color={COLORS.white} />
              <Text style={styles.dateTimeText}>{startHour ? startHour : 'No Start Time'}</Text>
              <Text style={styles.dateTimeText}>{endHour ? endHour : 'No End Time'}</Text>
            </View>
          </View>
          <View style={styles.footer}>
            <Pressable style={styles.button} onPress={handleDeleteItem}>
              <Ionicons name='trash' size={30} color={COLORS.white} />
            </Pressable>
            <Pressable style={styles.button} onPress={toggleCompletion}>
              <Ionicons name={completed ? 'ios-checkmark-circle' : 'ios-checkmark-circle-outline'} size={24} color={COLORS.red} />
            </Pressable>
            <Pressable style={styles.button} onPress={() => handleEdit(task_id)} >
              <Ionicons name="md-create" size={30} color={COLORS.white} />

            </Pressable>
            {selectedTask && (
              <EditTaskModal
                visible={isEditModalVisible}
                task={selectedTask}
                onSave={(editedTask) => {
                  handleEditTask(userEmail, editedTask);                            // Implement the onSave logic here

                }}
                onCancel={() => handleOnCancel()} // Hide the EditTaskModal
              />
            )}

          </View>
        </LinearGradient>
      </Animated.View>
    </SafeAreaView >
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32

  },

  LinerGradientContainer: {
    justifyContent: 'space-around',
    padding: 16,
    flex: 1

  },
  goalItem: {
    marginTop: 25,
    overflow: 'hidden',
    justifyContent: 'center', // Center the content vertically
    borderRadius: 10,
    borderWidth: 1.4,
    alignSelf: 'center',
    width: 300,
    height: 350,
  },
  titleContainer: {
    alignItems: 'center',
  },
  dateTimeContainer: {
    marginTop: 8,
    alignItems: 'center', // Align items at the center
  },
  taskText: {
    color: COLORS.white,
    // color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,

  },
  TextStyle: {
    fontSize: 18,
    letterSpacing: 1,
    fontWeight: 'bold'
  },
  timeContainer: {
    marginTop: 8,
  },
  dateContainer: {
    marginBottom: 8,
  },
  buttonContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8

  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Distribute items evenly along the row
    alignItems: 'center',
    marginTop: 10,
  },

  button: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    color: 'white'
  },

  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    backgroundColor: COLORS.primary, // Change this to match your background color
    borderRadius: 12,
  },
  LinerGradientContainer: {
    justifyContent: 'space-around',
    padding: 16,
    flex: 1,
  },
  goalItem: {
    marginTop: 25,
    overflow: 'hidden',
    borderRadius: 20,
    borderWidth: 1.4,
    alignSelf: 'center',
    width: 320,
    height: 380,
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
  },
  descriptionContainer: {
    paddingHorizontal: 20,
  },
  descriptionText: {
    color: COLORS.white,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
  },
  dateTimeTextContainer: {
    alignItems: 'center',
  },
  dateTimeText: {
    color: COLORS.white,
    fontSize: 12,
    marginTop: 4,
  },
});


export default GoalItem;
