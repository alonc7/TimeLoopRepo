const db = require('../DB/DB');
const mongodb = require('mongodb');
const User = require('./userModel');

class Task {
    static collection = 'Tasks';

    constructor(title, description, startDate, dueDate, startTime, dueTime, priority) {
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.dueDate = dueDate;
        // this.IsOnDate=true; // task that is still not after due of due Date
        // this.IsOnTime=true; // task that is still not after due of dueTime .
        this.startTime = startTime;
        this.dueTime = dueTime;
        this.priority = priority;
        this.status = 'pending'; // Add the status field with the default value 'pending'
    };
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
    }
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


    static async createTask(user, task) {
        try {
            const query = user;

            task._id = new mongodb.ObjectId(); // Generate a unique ID for the task
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

    static async completeTask(userEmail, taskId) {
        try {
            const user = await User.findUserByEmail(userEmail);
            if (!user) {
                throw new Error('User not found');
            }
            await new db().CompleteTask(User.collection, user, taskId);

            return true;
        } catch (error) {
            throw new Error('Failed to complete task');
        }
    }

    static async removeTask(userEmail, taskId) {
        try {
            const user = await User.findUserByEmail(userEmail);
            if (!user) {
                throw new Error('User not found');
            }
            await new db().RemoveTask(User.collection, user, taskId);

            return true;
        } catch (error) {
            throw new Error('Failed to complete task');
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