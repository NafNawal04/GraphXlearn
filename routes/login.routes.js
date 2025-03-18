const express = require('express');
const path = require('path');
const router = express.Router();
const passport = require('passport');
const loginController = require('../controller/login.controller.js'); 


router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../resources/html_files/login.html')); 
});

router.post('/login', loginController.handleLogin);
router.get('/forgot-password', (req, res) => {
    res.sendFile(path.join(__dirname, '../resources/html_files/forgotpassword.html'));
});

router.post('/forgot-password', loginController.handleForgotPassword);

router.get('/reset-password/:token', (req, res) => {
    const token = req.params.token;
    res.render('resetpassword', { token }); // Pass token to the template
});

router.post('/reset-password/:token', loginController.handleResetPassword);


module.exports = router;