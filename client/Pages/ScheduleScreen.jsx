import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import CalendarComponent from '../Components/CalendarComponent';
import { MainContext } from '../Components/Context/MainContextProvider';
import { Server_path } from '../utils/api-url'

const ScheduleScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState([]);
  const { userEmail } = useContext(MainContext);

  useEffect(() => {
    loadAllTasks(userEmail);
  }, [userEmail]);

  const loadAllTasks = async (userEmail) => {
    try {
      const response = await fetch(`${Server_path}/api/tasks/allTasks/${userEmail}`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);

      } else {
        throw new Error('Request failed');
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const handleAddTask = (task) => {
    setTasks((prevState) => [...prevState, task]);
  };

  const handleDayPress = (date) => {
    // Convert the selected date to the desired format "2023/07/01"
    const formattedDate = date.dateString.split('-').join('/');
    setSelectedDate(formattedDate);
  };

  const filteredTasks = tasks.filter((task) => task.startDate === selectedDate);

  return (
    <View style={styles.container}>
      <CalendarComponent tasks={tasks} onDayPress={handleDayPress} selectedDate={selectedDate} />

      {selectedDate ? (
        <View style={{ flex: 1 }}>
          <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.taskContainer}>
                <Text style={styles.taskText}>{item.title}</Text>
                {item.startTime && <Text style={styles.dateText}>Start Time: {item.startTime}</Text>}
                {item.dueTime && <Text style={styles.dateText}>Due Time: {item.dueTime}</Text>}
                <Text style={styles.priorityText}>Priority: {item.priority}</Text>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No tasks scheduled for {selectedDate}.</Text>
              </View>
            }
          />
        </View>
      ) : (
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
    // borderBottomColor: 'white',
    borderBottomWidth: 2,
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
  priorityText: {
    fontSize: 14,
    color: 'blue',
  },
});

export default ScheduleScreen;
