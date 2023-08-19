const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Task = require('../models/taskModel');


router.get('/allTasks/:userEmail', async (req, res) => {
    try {
        const { userEmail } = req.params;
        const user = await User.findUserByEmail(userEmail);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const taskList = await Task.getTaskList(userEmail);
        res.status(200).json(taskList)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'no Tasks found.' })
    }
});

router.get('/getPendingTaskList/:userEmail', async (req, res) => {
    try {
        const { userEmail } = req.params;
        const user = await User.findUserByEmail(userEmail);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const pendingTaskList = await Task.getPendingTaskList(userEmail);
        res.json(pendingTaskList);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the pending task list.' });
    }
});
router.get('/getCompletedTaskList/:userEmail', async (req, res) => {
    try {
        const { userEmail } = req.params;
        const user = await User.findUserByEmail(userEmail);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const completedTaskList = await Task.getCompletedTaskList(userEmail)
        res.json(completedTaskList);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the pending task list.' });
    }
});



// PUT edit task
router.put('/editTask', async (req, res) => {
    try {
        const { userEmail, updatedTask } = req.body;
        const user = await User.findUserByEmail(userEmail);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const updatedUser = await Task.updateTask(user, updatedTask);

        if (updatedUser) {
            res.status(200).json({ message: 'Task updated successfully' });
        } else {
            res.status(500).json({ error: 'Failed to update task' });
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
        const success = await Task.findTaskByKey(taskKey);
        if (success) {
            res.json({ message: 'Task deleted successfully' });
        } else {
            res.status(404).json({ error: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

// complete a task by taskKey
router.put('/completeTask', async (req, res) => {
    try {
        const { userEmail, taskId } = req.body;
        const user = await User.findUserByEmail(userEmail);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user) {
            await Task.completeTask(user.email, taskId);
            res.status(201).json('Task completed successfully');
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to complete task' });
    }
});

router.put('/removeTask', async (req, res) => {
    try {
        const { userEmail, taskId } = req.body;
        const user = await User.findUserByEmail(userEmail);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user) {
            await Task.removeTask(user.email, taskId);
            res.status(201).json('Task removed successfully');
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to complete task' });
    }
});
// POST create task
router.post('/addTask', async (req, res) => {
    const { userEmail, title, description, startDate, dueDate, key, startTime, dueTime, priority } = req.body;
    try {
        const task = new Task(title, description, startDate, dueDate, key, startTime, dueTime, priority); //
        const authUser = await User.findUserByEmail(userEmail);
        if (authUser) {
            await Task.createTask(authUser, task);
            res.status(201).json('Task created successfully');
        }
        else (
            res.status(403).json('You are unauthorized')
        )
    } catch (error) {
        res.status(500).json({ error: 'Failed to create task in addTask' });
    }
});

module.exports = router;
