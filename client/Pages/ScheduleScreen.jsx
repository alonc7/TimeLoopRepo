import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import CalendarComponent from '../Components/CalendarComponent';
import { MainContext } from '../Components/Context/MainContextProvider';
import { Server_path } from '../utils/api-url';
import COLORS from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

const ScheduleScreen = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [expandedItemId, setExpandedItemId] = useState(null); // Track expanded item
  const { pendingTaskList } = useContext(MainContext);

  // Handler for when a day is pressed on the calendar
  const handleDayPress = (date) => {
    const formattedDate = date.dateString.split('-').join('/');
    setSelectedDate(formattedDate);
    setExpandedItemId(null); // Reset expanded item when selecting a new date
  };

  // Filter tasks based on the selected date
  const filteredTasks = pendingTaskList.filter((task) => task?.startDate === selectedDate);

  return (
    <View style={styles.container}>
      {/* Calendar */}
      <CalendarComponent tasks={pendingTaskList} onDayPress={handleDayPress} selectedDate={selectedDate} />

      {selectedDate ? (
        // Display tasks for the selected date
        <View style={styles.tasksContainer}>
          <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.taskContainer,
                  {
                    borderColor:
                      item.priority === 'high'
                        ? COLORS.red
                        : item.priority === 'medium'
                        ? 'orange'
                        : COLORS.grey,
                  },
                ]}
                onPress={() => setExpandedItemId(expandedItemId === item._id ? null : item._id)}
              >
                <View style={styles.taskHeader}>
                  <Text style={styles.taskText}>{item.title}</Text>
                  <TouchableOpacity onPress={() => setExpandedItemId(item._id)}>
                    <Ionicons name="add-circle-outline" size={24} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
                {expandedItemId === item._id && (
                  // Show detailed information for an expanded task
                  <View>
                    {item.startTime && <Text style={styles.dateText}>Start Time: {item.startTime}</Text>}
                    {item.dueTime && <Text style={styles.dateText}>Due Time: {item.dueTime}</Text>}
                    <Text
                      style={[
                        styles.priorityText,
                        {
                          color:
                            item.priority === 'high'
                              ? COLORS.red
                              : item.priority === 'medium'
                              ? 'orange'
                              : COLORS.grey,
                        },
                      ]}
                    >
                      Priority: {item.priority}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              // Display message when no tasks are scheduled for the selected date
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No tasks scheduled for {selectedDate}.</Text>
              </View>
            }
          />
        </View>
      ) : (
        // Display default message when no date is selected
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Select a date to view tasks.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.secondary,
  },
  tasksContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.grey,
  },
  taskContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: COLORS.white,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  taskText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  dateText: {
    fontSize: 14,
    color: COLORS.grey,
  },
  priorityText: {
    fontSize: 14,
    color: COLORS.primary,
  },
});

export default ScheduleScreen;
