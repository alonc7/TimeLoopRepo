/**
 * CalendarComponent Component
 *
 * This component displays a calendar with marked dates representing tasks.
 *
 * @component
 * @example
 * // Example Usage:
 * import CalendarComponent from './CalendarComponent';
 * // ...
 * <CalendarComponent tasks={[]} onDayPress={() => {}} selectedDate="2023-09-10" />
 *
 * @param {object} tasks - An array of tasks with start dates and priorities.
 * @param {function} onDayPress - A function to handle day press events.
 * @param {string} selectedDate - The currently selected date.
 *
 * @returns {JSX.Element} A React component that displays the CalendarComponent.
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import COLORS from '../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

const CalendarComponent = ({ tasks, onDayPress, selectedDate }) => {
  // Function to convert date format from "YYYY/MM/DD" to "YYYY-MM-DD"
  const convertDateFormat = (dateString) => {
    const [year, month, day] = dateString.split('/');
    return `${year}-${month?.padStart(2, '0')}-${day?.padStart(2, '0')}`;
  };

  // Function to mark dates with tasks
  const markDates = () => {
    const markedDates = {};
    const MAX_DOTS_PER_DATE = 3;

    tasks.forEach((task) => {
      const { startDate, priority } = task;
      const convertedDate = convertDateFormat(startDate);

      // Create a new array of dots or initialize an empty array
      markedDates[convertedDate] = markedDates[convertedDate] || { dots: [] };

      if (markedDates[convertedDate].dots.length < MAX_DOTS_PER_DATE) {
        // Add the dot for the current task's priority to the dots array
        markedDates[convertedDate].dots.push({
          key: task._id,
          color: getColorByPriority(priority),
        });
      }
    });

    // Add the selected date to the markedDates object
    if (selectedDate) {
      const convertedSelectedDate = convertDateFormat(selectedDate);
      markedDates[convertedSelectedDate] = markedDates[convertedSelectedDate] || { dots: [] };
      markedDates[convertedSelectedDate].selected = true;
      markedDates[convertedSelectedDate].selectedColor = 'lightblue';
    }
    return markedDates;
  };

  // Function to get the color based on task priority
  const getColorByPriority = (priority) => {
    switch (priority) {
      case 'low':
        return 'grey';
      case 'medium':
        return 'orange';
      case 'high':
        return COLORS.red;
      default:
        return 'grey';
    }
  };

  return (
    <View>
      <Calendar
        // Minimum and maximum date that can be selected
        minDate={'2023-01-01'}
        maxDate={'2030-12-31'}
        // Date marking style [simple/period/multi-dot/custom]. Default = 'simple'
        markingType={'multi-dot'}
        // Date marking style
        markedDates={markDates()}
        // Handler for day press
        onDayPress={onDayPress}
        style={styles.calendarContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    marginTop: 25,
    padding: 15,
    marginBottom: 15,
    borderRadius: 5,
    elevation: 15,
    borderRadius: 10,
    borderColor: "lightblue",
    borderWidth: 3,
  },
});

export default CalendarComponent;
