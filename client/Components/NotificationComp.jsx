import { View, StyleSheet } from 'react-native';
import React, { useEffect, useContext } from 'react';
import * as Notification from 'expo-notifications';
import { MainContext } from './Context/MainContextProvider';

Notification.setNotificationHandler({
    handleNotification: async () => {
        return {
            shouldPlaySound: true,
            shouldSetBadge: true,
            shouldShowAlert: true,
        };
    },
});

export default function NotificationComp() {
    const { pendingTaskList } = useContext(MainContext);

    useEffect(() => {
        scheduleTaskNotifications();
    }, [pendingTaskList]);

    function scheduleTaskNotifications() {
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Reset time components to midnight
        // const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const today = new Date(now);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        // Convert today and tomorrow to the required format
        const formattedToday = formatDate(today);
        const formattedTomorrow = formatDate(tomorrow);

        // Filter tasks with repeatTask set to true
        const repeatTaskList = pendingTaskList.filter(task => task.isReapet);


        pendingTaskList.forEach(task => {
            if (!task.startDate || !task.dueDate) {
                // Skip tasks with null dates
                return;
            }

            const taskStartDate = (task.startDate);
            const taskDueDate = (task.dueDate);
            // const formattedTaskStartDate = formatDate(taskStartDate);
            // const formattedTaskDueDate = formatDate(taskDueDate);

            if (taskDueDate === formattedToday) {
                scheduleNotificationHandler(task._id, 'Task Due Today', `"${task.title}" is due today`);
            } else if (taskDueDate === formattedTomorrow) {
                scheduleNotificationHandler(task._id, 'Task Due Tomorrow', `"${task.title}" is due tomorrow`);
            }

            if (taskStartDate === formattedToday) {
                scheduleNotificationHandler(task._id, 'Task Starting Today', `"${task.title}" is starting today`);
            } else if (taskStartDate === formattedTomorrow) {
                console.log(taskStartDate, formattedTomorrow, formattedToday);
                scheduleNotificationHandler(task._id, 'Task Starting Tomorrow', `"${task.title}" is starting tomorrow`);
            }
        });

        repeatTaskList.forEach(task => {
            // Check if the task has repeatOption set to 'daily'
            if (task.repeatOption === 'daily') {
                scheduleNotificationHandler(task._id, 'Daily Reminder', `"${task.title}"`, task.selectedTime)
            };


            // Check if the task has repeatOption set to 'custome' and it's the due/start date
            if (task.repeatOption === "custome") {
                const currentDay = now.getDay();
                const currentTime = task.selectedTime;

                if (task.selectedDays.includes(currentDay) && now === task.selectedTime) {
                    scheduleNotificationHandler(task._id, 'Costume reminder', `"${task.title}"`, task.selectedTime)
                }
            };
        })

    }



    function formatDate(date) {
        return date.toISOString().split('T')[0].split('-').join('/');
    }




    function scheduleNotificationHandler(taskId, title, body) {
        Notification.scheduleNotificationAsync({
            content: {
                title,
                body,
                data: { taskId: taskId },
            },
            trigger: null, // You need to set appropriate triggers here
        });
    }

    return (
        <View style={styles.container}>
            {/* You can render your UI components here */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        backgroundColor: 'white',
    },
});
