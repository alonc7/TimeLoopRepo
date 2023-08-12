import React from 'react';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarComponent = ({ tasks, onDayPress, selectedDate }) => {
  // Thank god for Helper function to convert date format from F***ing "YYYY/MM/DD" to WHAT-F***ing-difference-"YYYY-MM-DD"
  const convertDateFormat = (dateString) => {
    const [year, month, day] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`; // padStart = method in JS strings. helps with placing 0 in single digit field.
  };

  const markDates = () => {
    const markedDates = {};

    tasks.forEach((task) => {
      const { startDate, priority } = task;
      const convertedDate = convertDateFormat(startDate);

      // Create a new array of dots or initialize an empty array
      markedDates[convertedDate] = markedDates[convertedDate] || { dots: [] };

      // Add the dot for the current task's priority to the dots array
      markedDates[convertedDate].dots.push({
        key: task._id,
        color: getColorByPriority(priority),
      });
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
        return 'red';
      default:
        return 'blue';
    }
  };

  return (
    <View>
      <Calendar
        // Minimum and maximum date that can be selected
        minDate={'2023-01-01'}
        maxDate={'2023-12-31'}
        // Date marking style [simple/period/multi-dot/custom]. Default = 'simple'
        markingType={'multi-dot'}
        // Date marking style
        markedDates={markDates()}
        // Handler for day press
        onDayPress={onDayPress}
      />
    </View>
  );
};

export default CalendarComponent;
