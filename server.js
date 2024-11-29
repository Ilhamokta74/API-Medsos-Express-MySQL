require('dotenv').config();
const express = require('express');
const routes = require('./routes/routes'); // Import routes
const db = require('./database/database'); // Database connection

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Gunakan routes
app.use(routes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
