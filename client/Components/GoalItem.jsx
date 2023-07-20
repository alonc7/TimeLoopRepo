import React, { useRef, useState } from 'react';
import { StyleSheet, View, Text, Pressable, SafeAreaView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';
// import AnimatedText from 'react-native-paper/lib/typescript/src/components/Typography/AnimatedText';

function GoalItem(props) {
  const { text, startDate, endDate, startHour, endHour, onDeleteItem, priority } = props;
  const [completed, setCompleted] = useState(false);

  const lineThroughAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  function handleDeleteItem() {
    console.log(props.id);
    Animated.timing(opacityAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => onDeleteItem(props.id));
  }


  function toggleCompletion() {
    setCompleted(!completed);
    if (!completed) {
      Animated.sequence([ //זהו מערך שעל פיו נקבע סדר האנימציות שאבהן אני רוצה שיקרו 
        Animated.timing(lineThroughAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.delay(300),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(); // פקודת הרצה למערך האנימציות
    } else {
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.delay(300),
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
      borderColor = 'red';
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
      <Pressable onPress={toggleCompletion}>
        <Animated.View style={[styles.goalItem, { borderColor, elevation: 5, opacity: opacityAnim }]}>
          <View style={styles.titleContainer}>
            <Ionicons
              name={completed ? 'ios-checkmark-circle' : 'ios-checkmark-circle-outline'}
              size={24}
              color={completed ? '#2ecc71' : '#ffffff'}
              onPress={toggleCompletion}
            />
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
            <View style={styles.dateContainer}>
              <Text>{`Start Date: ${startDate}`}</Text>
              <Text>{`End Date: ${endDate}`}</Text>
            </View>
            <View style={styles.timeContainer}>
              <Text>{`Start Hour: ${startHour}`}</Text>
              <Text>{`End Hour: ${endHour}`}</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Pressable onPress={handleDeleteItem}>
              <Ionicons name='trash' size={30} color={completed ? '#2ecc71' : '#ffffff'} />
            </Pressable>
          </View>
        </Animated.View>
      </Pressable>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 25
  },
  goalItem: {
    flexDirection: 'column', // Change to column
    alignItems: 'center', // Align items at the center
    justifyContent: 'center', // Center the content vertically
    padding: 16,
    borderRadius: 10,
    borderWidth: 4,
    backgroundColor: COLORS.primary,
    marginVertical: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTimeContainer: {
    marginTop: 8,
    alignItems: 'center', // Align items at the center
  },
  taskText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
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
  },
});

export default GoalItem;
