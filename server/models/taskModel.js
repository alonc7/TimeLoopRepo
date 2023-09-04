const db = require('../DB/DB');
const { ObjectId } = require('mongodb');
const User = require('./userModel');

class Task {
    static collection = 'Tasks';
    // Modify Task Data Structure:

    // Update your task data structure to include information about repeated tasks. You can add fields like isRepeated, repeatOption, selectedDays, selectedTime, startDate, and endDate to your task objects.
    constructor(title, description, startDate, dueDate, startTime, dueTime, priority, isRepeat, repeatOption = 'none', selectedDays = [], selectedTime, _id) {
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.dueDate = dueDate;
        this.startTime = startTime;
        this.dueTime = dueTime;
        this.priority = priority;
        // this.isOnTime = isOnTime; // task that is still not after due of dueTime .
        // this.isRepeated = isRepeated; // Indicates if the task is repeated
        this.isRepeat = isRepeat;
        this.repeatOption = repeatOption; // Options: 'none', 'daily', 'weekly', 'monthly', etc.
        this.selectedDays = selectedDays; // Array of selected days for weekly or monthly repetition
        this.selectedTime = selectedTime; // Time of day for the task
        this._id = _id;
        this.status = 'pending'; // Add the status field with the default value 'pending'
    }
    // GET list of all tasks.
    static async getTaskList(userId) {
        try {
            const user = await User.findUserByEmail(userId);
            if (!user) {
                throw new Error('User not found');
            }
            // let taskList = [];
            // if (user.Tasks && Array.isArray(user.Tasks)) {
            //     user.Tasks.forEach(taskObj => {
            //         taskList.push(taskObj.task);
            //     });
            // }
            return user.Tasks || []; // Wrap taskList in an object for the correct assignment
        } catch (error) {
            console.error(error);
            return []; // Wrap an empty array in an object for consistency
        }
    }
    static async getPendingTaskList(userEmail) {
        try {

            const user = await User.findUserByEmail(userEmail);
            if (!user) {
                throw new Error('User not found');
            }

            let taskList = user.Tasks.filter((task) => task.status === 'pending');

            return taskList;
        } catch (error) {
            console.error(error);
            return [];
        }
    };
    static async getRemovedTaskList(userEmail) {
        try {

            const user = await User.findUserByEmail(userEmail);
            if (!user) {
                throw new Error('User not found');
            }

            let taskList = user.Tasks.filter((task) => task.status === 'removed');

            return taskList;
        } catch (error) {
            console.error(error);
            return [];
        }
    };
    static async getCompletedTaskList(userEmail) {
        try {

            const user = await User.findUserByEmail(userEmail);
            if (!user) {
                throw new Error('User not found');
            }

            let taskList = user.Tasks.filter((task) => task.status === 'completed');


            return taskList;
        } catch (error) {
            console.error(error);
            return [];
        }
    }


    // static async createTask(user, task) {
    //     try {
    //         const query = user;

    //         task._id = new ObjectId(); // Generate a unique ID for the task
    //         if (!query.Tasks) {
    //             query.Tasks = [];
    //         }
    //         // Update the user document in the database with the updated tasks array
    //         await new db().AddTaskToUser(User.collection, query, task);

    //         return task;
    //     } catch (error) {
    //         console.log(error);
    //         throw new Error('Failed to create task in createTask');
    //     }
    // }
    static async createTask(user, task) {
        try {
            const query = user;

            // task._id = new ObjectId(); // Generate a unique ID for the task
            if (!query.Tasks) {
                query.Tasks = [];
            }
            // Update the user document in the database with the updated tasks array
            await new db().AddTaskToUser(User.collection, query, task);

            return task;
        } catch (error) {
            console.log(error);
            throw new Error('Failed to create task in createTask');
        }
    }

    static async completeTask(user, completedTasks) {
        try {
            let tasks = [...user.Tasks];
            for (let i = 0; i < tasks.length; i++) {
                let task = tasks[i];
                for (let j = 0; j < completedTasks.length; j++) {
                    let id = completedTasks[j];
                    if (id === task._id)
                        task.status = 'completed';
                }
            }
            await new db().CompleteTask(User.collection, user, tasks);

            return true;
        } catch (error) {
            throw new Error('Failed to complete task');
        }
    }

    static async removeTask(user, deletedTasks) {
        try {

            let tasks = [...user.Tasks];
            for (let i = 0; i < tasks.length; i++) {
                let task = tasks[i];
                for (let j = 0; j < deletedTasks.length; j++) {
                    let id = deletedTasks[j];
                    if (id === task._id)
                        task.status = 'removed';
                }
            }

            await new db().RemoveTask(User.collection, user, tasks);

            return true;
        } catch (error) {
            throw new Error('Failed to complete task');
        }
    }

    static async pendTask(user, taskId) {
        try {

            let tasks = user.Tasks.map((task) => {
                if (new ObjectId(taskId).equals(task._id)) {
                    console.log(task._id);
                    task.status = 'pending'
                }
                return task;
            })
            await new db().pendTask(User.collection, user, tasks);

            return true;
        } catch (error) {
            throw new Error('Failed to pend task');
        }
    }






    // get task by its key if exists
    static async findTaskByKey(key) {
        try {
            const query = { key };
            const tasks = await new db().FindAll(Task.collection, query);
            if (tasks.length === 0) {
                return null; // User not found
            }
            return tasks[0]; // Return the first user found
        } catch (error) {
            throw new Error('Failed to find task');
        }
    };
    static async findUserById(userEmail) {
        try {
            const query = { userEmail };
            return await new db().FindOne(User.collection, query);
        } catch (error) {
            throw new Error('Failed to find user');
        }
    }
    //Delete task.
    static async deleteTask(taskId) {
        try {
            const query = { _id: taskId }
        } catch (error) {
            throw new Error('Failed to delete task')
        }
    }
    //Sorting and Ordering 
    // static async sortTasks(sortCriterion) {
    //     try {
    //         const sortQuery = {}; // Define the sorting query based on the criterion
    //         return await new db().FindAll(Task.collection, {}, sortQuery);
    //     } catch (error) {
    //         throw new Error('Failed to sort tasks');
    //     }
    // }
    // Update task status
    static async updateTaskStatus(taskId, currentDate) {
        try {
            const query = { _id: mongodb.ObjectId(taskId) };
            const task = await new db().FindOne(Task.collection, query);

            if (!task) {
                throw new Error('Task not found');
            }

            const dueDate = new Date(task.dueDate);
            const completedDate = new Date(currentDate);

            let status;
            if (completedDate <= dueDate) {
                status = 'completed on time';
            } else {
                status = 'completed after due';
            }

            const update = { $set: { status: status } };
            await new db().UpdateById(Task.collection, query, update);
            return true;
        } catch (error) {
            throw new Error('Failed to update task status');
        }
    };

    static async updateTask(user, updatedTask) {
        try {
            const taskIndex = user.Tasks.findIndex(task => task._id.toString() === updatedTask._id);
            if (taskIndex === -1) {
                return null;
            }
            user.Tasks[taskIndex] = updatedTask;
            await new db().UpdateUserTasks(User.collection, user.email, user.Tasks);
            return user;
        } catch (error) {
            console.error('Failed to update task:', error);
            throw error;
        }
    }

    static async updateTaskByKey(taskKey, updatedTask) {
        try {
            const query = { _id: new mongodb.ObjectId(taskKey) };
            const update = { $set: updatedTask };
            await new db().UpdateById(Task.collection, query, update);

            return true; // Successfully updated
        } catch (error) {
            console.error(error);
            return false; // Failed to update
        }
    }

}
module.exports = Task;