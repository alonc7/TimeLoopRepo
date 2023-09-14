import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { FloatingAction } from 'react-native-floating-action';
import COLORS from '../../constants/colors';
import { MainContext } from '../Context/MainContextProvider';

export default function FloatingActionBtn() {
  const { pendingTaskList, setPendingTaskList } = useContext(MainContext);

  const sortTasksByPriority = () => {
    const sortedPendingTaskList = [...pendingTaskList].sort(comparePriority);
    setPendingTaskList(sortedPendingTaskList);
  };
  const sortTasksByDate = () => {
    const sortedPendingTaskList = [...pendingTaskList].sort(compareDate);
    setPendingTaskList(sortedPendingTaskList);
  };

  const comparePriority = (a, b) => {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  };

  const compareDate = (a, b) => {
    // Format task start dates for sorting (because  a.startDate and b.startDate are in the "yyyy/mm/dd" format)
    const aStartDateParts = a.startDate.split('/').map(Number);
    const bStartDateParts = b.startDate.split('/').map(Number);
    const aStartDate = new Date(aStartDateParts[0], aStartDateParts[1] - 1, aStartDateParts[2]);
    const bStartDate = new Date(bStartDateParts[0], bStartDateParts[1] - 1, bStartDateParts[2]);
    return aStartDate - bStartDate;
  };


  const actions = [
    {
      text: 'Sort by Priority',
      icon: <MaterialIcons name="category" size={20} color={COLORS.white} />,
      name: 'Priority',
      position: 2,
    },
    {
      text: 'Sort by Date',
      icon: <MaterialIcons name="schedule" size={20} color={COLORS.white} />,
      name: 'Date',
      position: 1,
    },
  ];

  return (
    <View style={styles.container}>
      <FloatingAction
        color={COLORS.secondary}
        position={'right'}
        buttonSize={34}
        overlayColor="transparent" // Set overlayColor to "transparent" to remove background color

        floatingIcon={<MaterialIcons name="list" size={34} color={COLORS.white} />}
        actions={actions}
        onPressItem={name => {
          switch (name) {
            case 'Priority':
              sortTasksByPriority();
              break;
            case 'Date':
              sortTasksByDate();
              break;
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
