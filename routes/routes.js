const express = require('express');
const User = require(`../api/User`)
const Photo = require(`../api/Photo`)

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

// Endpoint Photo
router.get('/photos', Photo.getDataPhoto);
router.get('/photos/:id', Photo.getDataPhoto);
router.post('/photos', jwtVerify, Photo.AddDataPhoto);
router.put('/photos/:id',jwtVerify, Photo.UpdateDataPhoto);
router.delete('/photos/:id', jwtVerify, Photo.DeleteDataPhoto);
router.post('/photos/login', Photo.loginPhoto);
router.get('/photos/download/:filename', Photo.downloadPhoto);

module.exports = router;
