require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Endpoint: Home
app.get('/', (req, res) => {
    res.status(200).json({
        responseCode: 200,
        message: "Selamat Datang di API Medsos",
        data: null,
    });
});

// Endpoint: Ambil semua data pengguna (contoh)
app.get('/users', (req, res) => {
    const query = 'SELECT * FROM users';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err.message);
            res.status(500).json({ responseCode: 500, message: 'Error fetching users', data: null });
            return;
        }
        res.status(200).json({ responseCode: 200, message: 'Users retrieved successfully', data: results });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
