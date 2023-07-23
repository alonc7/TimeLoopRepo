import React from 'react';
import { View, Text } from 'react-native';
import { PieChart, ProgressChart } from 'react-native-chart-kit';

const Charts = () => {
  // Sample data (You'll fetch this from your API)
  const taskManagementData = {
    totalTasks: 100,
    completedTasks: 60,
    taskCompletionTime: 25, // in minutes
  };

  // Calculate task completion rate
  const completionRate = (taskManagementData.completedTasks / taskManagementData.totalTasks) * 100;

  return (
    <View>
      <Text>Total Tasks: {taskManagementData.totalTasks}</Text>
      <Text>Completed Tasks: {taskManagementData.completedTasks}</Text>
      <Text>Task Completion Rate: {completionRate.toFixed(2)}%</Text>
      <Text>Average Task Completion Time: {taskManagementData.taskCompletionTime} minutes</Text>

      {/* Pie Chart to show task completion rate */}
      <PieChart
        data={[
          { name: 'Completed', value: taskManagementData.completedTasks },
          { name: 'Remaining', value: taskManagementData.totalTasks - taskManagementData.completedTasks },
        ]}
        width={300}
        height={200}
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        accessor="value"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />

      {/* Progress Chart to show average task completion time */}
      <ProgressChart
        data={[taskManagementData.taskCompletionTime / 60]} // Convert minutes to hours for better visualization
        width={300}
        height={50}
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        strokeWidth={16}
        radius={32}
        hideLegend={true}
      />
    </View>
  );
};

export default Charts;
