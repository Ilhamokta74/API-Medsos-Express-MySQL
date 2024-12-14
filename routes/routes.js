const express = require('express');
const User = require(`../api/User`);
const Photo = require(`../api/Photo`);
const Comment = require(`../api/comment`);

// Middleware
const { jwtVerify, getDataJwt } = require(`../middleware/jwtVerify`)

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
router.post('/photos', jwtVerify, getDataJwt, Photo.AddDataPhoto);
router.put('/photos/:id', jwtVerify, getDataJwt, Photo.UpdateDataPhoto);
router.delete('/photos/:id', jwtVerify, getDataJwt, Photo.DeleteDataPhoto);
router.get('/static/photos/:filename', Photo.cekPhotos);

// Endpoint Comment
router.get('/comment', Comment.GetComments)
router.get('/comment/:id', jwtVerify, Comment.GetComments)
router.post('/comment/:id', jwtVerify, getDataJwt, Comment.AddComment)
router.put('/comment/:id', jwtVerify, getDataJwt, Comment.UpdateComment)
router.delete('/comment/:id', jwtVerify, getDataJwt, Comment.DeleteComment)

module.exports = router;