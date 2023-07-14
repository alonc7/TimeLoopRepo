const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Task = require('../models/taskModel');

// POST create task

// Get all tasks for a user
router.get('/:userEmail', async (req, res) => {
    try {
        const userEmail = req.params.userEmail;
        const result = await Task.findUserById(userEmail);
        console.log(result);
        if (!result) {
            return res.status(404).json({ message: 'No Tasks Found' });
        } else {
            return res.status(200).send({ tasks: result });
        }
    } catch (err) {
        console.error(`Error in getting tasks ${err}`);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// POST create task
router.post('/addTask', async (req, res) => {
    const { userEmail, title, startDate, dueDate, key, startTime, dueTime, priority } = req.body;
    try {
        const task = new Task(title, startDate, dueDate, key, startTime, dueTime, priority); //
        const authUser = await User.findUserByEmail(userEmail);
        if (authUser) {
            const createdTask = await Task.createTask(authUser, task); // Pass the object user and object task.
            res.status(201).json(createdTask);
        }
        else (
            res.status(403).json('You are unauthorized')
        )
    } catch (error) {
        res.status(500).json({ error: 'Failed to create task in addTask' });
    }
});

// router.post('/addTask', async (req, res) => {
//     const { userEmail, title, startDate, dueDate, key, startTime, dueTime, priority } = req.body;
//     try {
//         // Retrieve the user document
//         const user = await User.findUserByEmail(userEmail);
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }
//         // Create a new task
//         const task = new Task(title, startDate, dueDate, key, startTime, dueTime, priority);
//         console.log(task);

//         user.tasks.push(task); // Add the task to the tasks array

//         // Save the updated user document
//         await user.save();

//         res.status(201).json({ message: 'Task created successfully' });
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to create task' });
//     }
// });

// GET single task by key
router.get('/getBykey/:key', async (req, res) => {
    const taskKey = req.params.key;

    try {
        const task = await Task.findTaskByKey(taskKey);
        if (!task) {
            res.status(404).json({ error: 'Task not found' });
        } else {
            res.json(task);
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve task' });
    }
});

// PUT update task by key
router.put('/updateByKey/:key', async (req, res) => {
    const taskKey = req.params.key;
    const updatedTask = req.body;

    try {
        const success = await Task.updateTaskByKey(taskKey, updatedTask);
        if (success) {
            res.json({ message: 'Task updated successfully' });
        } else {
            res.status(404).json({ error: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
});
// PUT update task status by taskId
router.put('/updateStatus/:taskId', async (req, res) => {
    const taskId = req.params.taskId;
    const currentDate = new Date(); // Get the current date

    try {
        const success = await Task.updateTaskStatus(taskId, currentDate);
        if (success) {
            res.json({ message: 'Task status updated successfully' });
        } else {
            res.status(404).json({ error: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task status' });
    }
});



// DELETE task by key
router.delete('/deleteByKey/:key', async (req, res) => {
    const taskKey = req.params.key;

    try {
        const success = await Task.deleteTaskByKey(taskKey);
        if (success) {
            res.json({ message: 'Task deleted successfully' });
        } else {
            res.status(404).json({ error: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

module.exports = router;
