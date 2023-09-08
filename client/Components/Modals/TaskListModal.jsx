import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Vibration, ToastAndroid } from 'react-native';
import { Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MainContext } from '../Context/MainContextProvider';
import EditTaskModal from './EditTaskModal';
import COLORS from '../../constants/colors';

function TaskListModal({ isVisible, taskList, onClose, isPendingTasks }) {
  const { deleteTask, completeTask, unComplete } = useContext(MainContext);
  const [expandedItemId, setExpandedItemId] = useState(null);

  return (
    <Modal visible={isVisible} animationType="slide" onDismiss={onClose} transparent={true} onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={() => {
            onClose();
            Vibration.vibrate(25);
          }} style={styles.closeButton}>
            <Ionicons name="close-circle" size={24} color={COLORS.secondary} />
          </TouchableOpacity>
          <Text style={styles.header}>
            {isPendingTasks ? 'Pending Tasks' : 'Completed Tasks'}
          </Text>
          <FlatList
            data={taskList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.taskItem,
                  {
                    borderColor:
                      item.priority === 'high'
                        ? COLORS.red
                        : item.priority === 'medium'
                          ? 'orange'
                          : 'grey',
                  },
                ]}
                keyExtractor={item => item._id}
                onPress={() => setExpandedItemId(expandedItemId === item._id ? null : item._id)}
              >
                <View style={styles.taskDetails}>
                  <Ionicons name="add-circle-outline" style={styles.addIcon} />
                  <Text style={styles.taskTitle}>{item.title}</Text>
                  {expandedItemId === item._id && (
                    <View>
                      {item.startDate && <Text style={styles.dateText}>{`Start Date: ${item.startDate}`}</Text>}
                      {item.endDate && <Text style={styles.dateText}>{`End Date: ${item.endDate}`}</Text>}
                      {item.description && <Text style={styles.description}>{item.description}</Text>}
                      {item.startTime && <Text style={styles.dateText}>Start Time: {item.startTime}</Text>}
                      {item.dueTime && <Text style={styles.dateText}>Due Time: {item.dueTime}</Text>}
                    </View>
                  )}
                </View>
                <View style={styles.taskFooter}>
                  <TouchableOpacity style={styles.iconContainer}>
                    {item.status === 'completed' ? (
                      <Text onPress={() => {
                        Vibration.vibrate(5);
                        unComplete(item);
                        const message = item.status === 'completed' ? 'Task reverted to pending' : 'Task completed';
                        ToastAndroid.show(message, ToastAndroid.SHORT);
                      }} style={styles.emoji}>↩️</Text>
                    ) : (
                      <Text onPress={() => {
                        Vibration.vibrate(5);
                        completeTask(item._id);
                      }} style={styles.emoji}>✅</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity>
                    {item.status === 'completed' ? (
                      <Text style={styles.emoji} onPress={() => {
                        Vibration.vibrate(50);
                        unComplete(item)

                        // Add logic here to move the task back to pending tasks
                        // This is where you would call a function to change the task status
                      }} >♻️</Text>)
                      // <AntDesign name="back" size={24} color={COLORS.secondary} 
                      : (
                        <Text style={styles.emoji} onPress={() => {
                          Vibration.vibrate(5);
                          deleteTask(item._id);

                          // Add logic here to move the task back to pending tasks
                          // This is where you would call a function to change the task status
                        }} >🗑️</Text>
                        // <Ionicons name="trash" size={24} color={COLORS.secondary} onPress={() => {
                        //   Vibration.vibrate(5);
                        //   deleteTask(item._id);
                        // }} />
                      )}
                  </TouchableOpacity>
                  <TouchableOpacity>
                    {item.status === 'completed' ? null : (
                      // <Ionicons name="md-create" size={24} onPress={() => handleEdit(item._id)} color={COLORS.secondary} style={styles.iconContainer} />
                      <Text style={styles.emoji} onPress={() => {
                        Vibration.vibrate(5);
                        // Add logic here to move the task back to pending tasks
                        // This is where you would call a function to change the task status
                      }} >📝</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item._id}
            alwaysBounceVertical={false}
          />
        </View>
      </View >
    </Modal >
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    fontSize: 20,
    color: COLORS.primary
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  taskItem: {
    flexDirection: 'column',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.black,
    borderStyle: 'dotted',
    borderRadius: 8,
    padding: 12,
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.black,
    alignSelf: 'center',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: COLORS.grey,
  },
  dateText: {
    fontSize: 14,
    color: COLORS.black,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: COLORS.black,
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    borderTopColor: COLORS.secondary,
    borderWidth: .9,
  },
  iconContainer: {
    alignItems: 'center',
    borderWidth: .2,
  },
  emoji: {
    fontSize: 16,
    color: COLORS.secondary,
  }
});

export default TaskListModal;
