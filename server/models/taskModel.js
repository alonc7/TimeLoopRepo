const db = require('../DB/DB');
const mongodb = require('mongodb');
const User = require('./userModel');

class Task {
    static collection = 'Tasks';

    constructor(title, startDate, dueDate, key, startTime, dueTime, priority) {
        this.title = title;
        this.startDate = startDate;
        this.dueDate = dueDate;
        this.key = key;
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
            let taskList = [];
            if (user.Tasks && Array.isArray(user.Tasks)) {
                user.Tasks.forEach(taskObj => {
                    taskList.push(taskObj.task);
                });
            }
            return taskList; // Wrap taskList in an object for the correct assignment
        } catch (error) {
            console.error(error);
            return { taskList: [] }; // Wrap an empty array in an object for consistency
        }
    }


    // insert task into tasks field. 
    static async createTask(user, task) {
        try {
            const query = user;

            task._id = new mongodb.ObjectId(); // Generate a unique ID for the task
            if (!query.Tasks) {
                query.Tasks = [];
            }
            // query.Tasks.push(task); // Push the task into the tasks array

            // Update the user document in the database with the updated tasks array
            await new db().EditByEmail(User.collection, query.email, { task });

            return task;
        } catch (error) {
            console.log(error);
            throw new Error('Failed to create task in createTask');
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

    //Update task.
    static async updateTask(taskId, updatedTask) {
        try {
            const query = { _id: mongodb.ObjectId(taskId) };
            await new db().UpdateOne(Task.collection, query, updatedTask);
            return true;
        } catch (error) {
            throw new Error('Failed to update task');
        }
    }
    static async findUserById(userEmail) {
        try {
            const query = { userEmail };
            return await new db().FindOne(User.collection, query);
        } catch (error) {
            throw new Error('Failed to find user');
        }
    }
    //Delete task.
    // static async deleteTask(taskId) {
    //     try {
    //         const query = { _id: mo }
    //     } catch (error) {
    //         throw new Error('Failed to delete task')
    //     }
    // }
    //Sorting and Ordering 
    static async sortTasks(sortCriterion) {
        try {
            const sortQuery = {}; // Define the sorting query based on the criterion
            return await new db().FindAll(Task.collection, {}, sortQuery);
        } catch (error) {
            throw new Error('Failed to sort tasks');
        }
    }
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
            await new db().UpdateOne(Task.collection, query, update);
            return true;
        } catch (error) {
            throw new Error('Failed to update task status');
        }
    }
}
module.exports = Task;