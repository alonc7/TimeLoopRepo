import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
// expo calender 
const ScheduleScreen = () => {
  const [tasks, setTasks] = useState([]);

  const handleAddTask = (task) => {
    setTasks((prevState) => [...prevState, task]);
  };

  const renderTaskList = () => {
    if (tasks.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tasks scheduled.</Text>
        </View>
      );
    }

    return tasks.map((task, index) => (
      <View key={index} style={styles.taskContainer}>
        <Text style={styles.taskText}>{task.description}</Text>
        <Text style={styles.dateText}>{task.date}</Text>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      {renderTaskList()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'gray',
  },
  taskContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  taskText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: 'gray',
  },
});

export default ScheduleScreen;
