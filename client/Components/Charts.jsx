import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PieChart from 'react-native-pie-chart';
import { BarChart } from 'react-native-chart-kit';
import { MainContext } from '../Components/Context/MainContextProvider';
import { Server_path } from '../utils/api-url';

const Charts = () => {
    const { userEmail,tasks, setTotalTaskList } = useContext(MainContext);

    useEffect(() => {
        const loadTask = async (userEmail) => {
            try {
                const response = await fetch(`${Server_path}/api/tasks/allTasks/${userEmail}`);
                if (response.ok) {
                    const data = await response.json(); //data returned from fetch result
                    setTotalTaskList(data);
                } else {
                    throw new Error('Request failed');
                }
            } catch (error) {
                console.error('Error loading tasks:', error);
            }
        };
        loadTask(userEmail);
    }, [userEmail]);

    const calculateTaskMetrics = () => {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter((task) => task.status === 'completed').length;

        // Assuming your tasks have a date field, you can count tasks for each day using a map
        const tasksByDay = {};
        tasks.forEach((task) => {
            const date = task.startDate; // Replace 'date' with the actual field name that stores the date of the task
            if (date) {
                if (date in tasksByDay) {
                    tasksByDay[date] += 1;
                } else {
                    tasksByDay[date] = 1;
                }
            }
        });

        return {
            totalTasks,
            completedTasks,
            tasksByDay,
        };
    };

    if (tasks.length === 0) {
        return <Text>Loading...</Text>;
    }

    const taskMetrics = calculateTaskMetrics();

    // Convert tasksByDay object to array for the BarChart
    const data = Object.keys(taskMetrics.tasksByDay).map((date) => ({
        date,
        count: taskMetrics.tasksByDay[date],
    }));

    return (
        <View style={styles.container}>
            {/* Pie Chart to show completion rate */}
            <PieChart
                widthAndHeight={200}
                series={[taskMetrics.completedTasks, taskMetrics.totalTasks - taskMetrics.completedTasks]}
                sliceColor={['#7B1FA2', '#38761d']}
                coverRadius={0.45}
                coverFill={'#FFF'}
            />

            {/* Performance Checks */}
            <View style={styles.performanceContainer}>
                <View style={[styles.dot, { backgroundColor: '#38761d' }]} />
                <Text style={styles.performanceText}>Completed</Text>
                <View style={[styles.dot, { backgroundColor: '#7B1FA2' }]} />
                <Text style={styles.performanceText}>Remaining</Text>
            </View>

            {/* Total Tasks */}
            <View style={styles.taskContainer}>
                <View style={[styles.dot, { backgroundColor: '#38761d' }]} />
                <Text style={styles.taskText}>Total Tasks: {taskMetrics.totalTasks}</Text>
                <View style={[styles.dot, { backgroundColor: '#7B1FA2' }]} />
                <Text style={styles.taskText}>Completed Tasks: {taskMetrics.completedTasks}</Text>
            </View>

            {/* Completed Tasks */}
            <View style={styles.barChartContainer}>
            <Text style={styles.barChartHeader}>Most Busy Day</Text>

            </View>

            {/* Bar Chart to show task counts by day */}
            <View >
                <BarChart
                    data={{
                        labels: data.map((item) => item.date),
                        datasets: [
                            {
                                data: data.map((item) => item.count),
                            },
                        ],
                    }}
                    width={400}
                    height={300}
                    chartConfig={{
                        backgroundColor: '#FFF',
                        backgroundGradientFrom: '#FFF',
                        backgroundGradientTo: '#FFF',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                    }}
                    showBarTops
                    showValuesOnTopOfBars
                    fromZero
                    withHorizontalLabels
                    verticalLabelRotation={30}
                    yAxisLabel=""
                    yAxisSuffix=""
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    performanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    performanceText: {
        fontSize: 15,
        color: '#7F7F7F',
    },
    taskContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    taskText: {
        fontSize: 16,
        marginLeft: 5,
    },
    barChartContainer: {
        marginTop: 20,
        alignItems: 'center', // Center the chart horizontally
    },
    barChartHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },

});

export default Charts;