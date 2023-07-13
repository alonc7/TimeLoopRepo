require('dotenv').config();

// Import libraries
const express = require('express');
const cors = require('cors');
const path = require('path');

// Define the port
const PORT = process.env.PORT || 5500;

// Create an instance of the Express server
const server = express();

// Enable Cross-Origin Resource Sharing (CORS)
server.use(cors());

// Parse JSON bodies
server.use(express.json());

// // Serve static files from the specified directory
server.use(express.static(path.join(__dirname, '../client', 'dist')));

// // Define routes for handling user-related requests
server.use('/api/users', require('./routes/route_user'));

// // Define routes for handling task-related requests
server.use('/api/tasks', require('./routes/route_task'));

// Serve the index.html file for all other routes
server.get('/*', async (req, res) => {
  res.sendFile(path.join(__dirname, '../client', 'dist', 'index.html'));
});

// Start the server
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
