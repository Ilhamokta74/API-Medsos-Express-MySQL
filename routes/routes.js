const express = require('express');
const User = require(`../api/User`)

// Middleware
const jwtVerify = require(`../middleware/jwtVerify`)

const router = express.Router();

// Endpoint: Home
router.get('/', (req, res) => {
    res.status(200).json({
        responseCode: 200,
        message: "Selamat Datang di API Medsos",
    });
});

// Endpoint User
router.get('/users', jwtVerify, User.getDataUser)
router.get('/users/:id', jwtVerify, User.getDataUser)
router.post('/users', User.AddDataUser)
router.put('/users/:id', jwtVerify, User.UpdateDataUser)
router.delete('/users/:id', jwtVerify, User.DeleteDataUser)
router.post('/users/login', User.loginUser);

module.exports = router;
