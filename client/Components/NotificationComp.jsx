import { View, StyleSheet } from 'react-native';
import React, { useEffect, useContext } from 'react';
import * as Notification from 'expo-notifications';
import { MainContext } from './Context/MainContextProvider';

// Set notification handler for Expo Notifications
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
    // Access the pending task list from the main context
    const { pendingTaskList } = useContext(MainContext);

    // UseEffect to schedule task notifications when pendingTaskList changes
    useEffect(() => {
        scheduleTaskNotifications();
    }, [pendingTaskList]);

    // UseEffect to create an interval for periodic notifications check
    useEffect(() => {
        // Create an interval to check for task notifications every 5 minutes (320000 milliseconds)
        const notificationInterval = setInterval(() => {
            repeatTaskNotifications()
        }, 320000);

        // Clean up the interval when the component unmounts
        return () => clearInterval(notificationInterval);
    }, [pendingTaskList]);


    // Define an array of uplifting titles for startDateTasks
    const startDateTasksUpliftingTitles = [
        "Get Started on a New Adventure!",
        "Today is the Day to Begin!",
        "Begin with Confidence!",
        "You Can Achieve Your Goals!",
        "Start Your Journey Today!",
        "The First Step is Important!",
        "You're Ready to Begin!",
        "Let's Make Progress Today!",
    ];

    // Define an array of upcoming task's due-related messages
    const taskDueMessages = [
        "It's time to conquer this task!",
        "You're almost there!",
        "just a little more to go!",
        "You're doing great - keep it up!",
        "You've got this task under control!",
        "One step closer to success!",
        "Belive in youself!",
        "Finish strong with this task!",
        "You're making progress - keep it up!",
    ];

    // Function to generate a random message
    function getRandomMessage(messagesArray) {
        const randomIndex = Math.floor(Math.random() * messagesArray.length);
        return messagesArray[randomIndex];
    }
    // Function to schedule task notifications
    // Get the current time in GMT+3 (EEST)
    function scheduleTaskNotifications() {
        // Create Date object for today at midnight in GMT+3 (EEST)
        const date = new Date();

        const day = date.getDate();
        const month = date.getMonth() + 1; // Months are zero-based
        const year = date.getFullYear();

        const formattedDateToday = `${year}/${month < 10 ? '0' + month : month}/${day < 10 ? '0' + day : day}`;
        const formattedDateTomorrow = `${year}/${month < 10 ? '0' + month : month}/${day + 1 < 10 ? '0' + (day + 1) : day + 1}`;

        const today = formattedDateToday;
        const tomorrow = formattedDateTomorrow;

        
        // Loop through pending tasks
        pendingTaskList.forEach(task => {
            if (!task.startDate || !task.dueDate) {
                // Skip tasks with null dates
                return;
            }

            const taskStartDate = task.startDate;
            const taskDueDate = task.dueDate;


            let randomUpliftingTitle = getRandomMessage(startDateTasksUpliftingTitles);
            let randomTaskDueMessage = getRandomMessage(taskDueMessages);
            // Schedule notifications based on due/start dates
            if (taskDueDate === today) {
                scheduleNotificationHandler(task._id, `"${randomTaskDueMessage}"`, `"${task.title}" is due today`);
            } else if (taskDueDate === tomorrow) {
                scheduleNotificationHandler(task._id, `"${randomTaskDueMessage}"`, `"${task.title}" is due tomorrow`);
            }

            if (taskStartDate === today) {
                scheduleNotificationHandler(task._id, `"${randomUpliftingTitle}"`, `"${task.title}" is starting today`);
            } else if (taskStartDate === tomorrow) {
                scheduleNotificationHandler(task._id, `"${randomUpliftingTitle}"`, `"${task.title}" is starting tomorrow`);
            }
        });


    }

    // Function to schedule repeated task notifications
    function repeatTaskNotifications() {
        let now = new Date().toLocaleString('en-US', { timeZone: 'Europe/Istanbul' });

        // Filter tasks with repeatTask set to true
        const repeatTaskList = pendingTaskList.filter(task => task.isReapet);

        // Loop through repeat tasks
        repeatTaskList.forEach(task => {
            // Check if the task has repeatOption set to 'daily' and the current time matches repeatSelectedTime
            if (task.repeatOption === 'daily' && now === task.repeatSelectedTime) {
                scheduleNotificationHandler(task._id, 'Daily Reminder', `"${task.title}"`, task.selectedTime);
            }

            // Check if the task has repeatOption set to 'custom' and it's the due/start date
            if (task.repeatOption === "custom") {
                const currentDay = new Date().getDay();

                if (task.selectedDays.includes(currentDay) && new Date() === task.selectedTime) {
                    scheduleNotificationHandler(task._id, 'Custom Reminder', `"${task.title}"`, task.selectedTime);
                }
            }
        });
    }
    // Function to format a date as "M/D/YYYY"
    function formatDate(date) {
        return date.toISOString().split('T')[0].split('-').join('/');
    }

    // Function to schedule a notification
    function scheduleNotificationHandler(taskId, title, body) {
        Notification.scheduleNotificationAsync({
            content: {
                title,
                body,
                data: { taskId },
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
