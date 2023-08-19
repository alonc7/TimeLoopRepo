import React, { useRef, useState, useContext } from 'react';
import { StyleSheet, View, Text, Pressable, SafeAreaView, Animated, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import { MainContext } from '../Components/Context/MainContextProvider';
import { Server_path } from '../utils/api-url';
import { LinearGradient } from 'expo-linear-gradient';

// import AnimatedText from 'react-native-paper/lib/typescript/src/components/Typography/AnimatedText';

function GoalItem(props) {
  const { text, description, startDate, endDate, startHour, endHour } = props;
  const [completed, setCompleted] = useState(false);
  const { userEmail, setPendingTaskList } = useContext(MainContext);

  const lineThroughAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  function handleDeleteItem() {
    Animated.timing(opacityAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => deleteTaskWithAPI(props.id));
  }

  // Function to mark the task as removed using API request
  async function deleteTaskWithAPI(taskId) {
    try {
      const response = await fetch(`${Server_path}/api/tasks/removeTask`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail, taskId }),
      });
      if (response.ok) {
        setPendingTaskList((currentListTasks) =>
          currentListTasks.filter((task) => task._id !== taskId)
        );
        Alert.alert('Task removed successfully');
      } else {
        console.log('Failed to remove task:', response.status);
      }
    } catch (error) {
      console.error('Error removing task:', error);
    }
  }

  // Function to mark the task as completed using API request

  async function completeTaskWithAPI(taskId) {
    try {
      const response = await fetch(`${Server_path}/api/tasks/completeTask`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail, taskId }),
      });
      if (response.ok) {
        setPendingTaskList((currentListTasks) =>
          currentListTasks.filter((task) => task._id !== taskId)
        );
        Alert.alert('Task completed successfully');
      } else {
        Alert.alert('Failed to complete task:', response.status);
      }
    } catch (error) {
      console.error('Error completing task:', error);
    }
  }

  // Function to handle the completion toggle
  function toggleCompletion() {
    setCompleted(!completed);
    if (!completed) {
      Animated.sequence([
        Animated.timing(lineThroughAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        completeTaskWithAPI(props.id); // Call the API function with the task ID (props.id)
      });
    } else {
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(lineThroughAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }




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
      borderColor = 'transparent'
  }

  return (

    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.goalItem, { borderColor, elevation: 0, opacity: opacityAnim }]}>
        <LinearGradient style={styles.LinerGradientContainer}
          colors={[COLORS.secondary, COLORS.primary]}
        >

          <View style={styles.titleContainer}>

            <Animated.Text
              style={[
                styles.taskText,
                {
                  textDecorationLine: completed ? 'line-through' : 'none',
                },
              ]}
            >
              {text}
            </Animated.Text>
          </View>
          <View style={styles.dateTimeContainer}>
            <View>
              <Text>{description}</Text>
            </View>
            <View style={styles.dateContainer}>
              <Text style={styles.TextStyle}>{startDate ? `Start Date: ${startDate}` : ''}</Text>
              <Text style={styles.TextStyle}>{endDate ? `End Date: ${endDate}` : ''}</Text>
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.TextStyle}>{startHour ? `Start Hour: ${startHour}` : ''}</Text>
              <Text style={styles.TextStyle}>{endHour ? `End Hour: ${endHour}` : ''}</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Pressable style={styles.button} onPress={handleDeleteItem}>
              <Ionicons name='trash' size={30} color={COLORS.white} />
            </Pressable>
            <Pressable style={styles.button} onPress={toggleCompletion}>
              <Ionicons name={completed ? 'ios-checkmark-circle' : 'ios-checkmark-circle-outline'} size={24} color={COLORS.red} />
            </Pressable>
            <Pressable style={styles.button}>
              <Ionicons name='md-create' size={24} color={COLORS.white} />
            </Pressable>
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
});


export default GoalItem;
