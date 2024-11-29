const express = require('express');
const User = require(`../api/User`)

const router = express.Router();

// Endpoint: Home
router.get('/', (req, res) => {
    res.status(200).json({
        responseCode: 200,
        message: "Selamat Datang di API Medsos",
    });
});

// Endpoint User
router.get('/users', User.getDataUser)
router.get('/users/:id', User.getDataUser)
router.post('/users', User.AddDataUser)
router.put('/users/:id', User.UpdateDataUser)
router.delete('/users/:id', User.DeleteDataUser)
router.post('/users/login', User.loginUser);

module.exports = router;
