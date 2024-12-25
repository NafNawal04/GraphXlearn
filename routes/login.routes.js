const express = require('express');
const path = require('path');
const router = express.Router();
const passport = require('passport');
const loginController = require('../controller/login.controller.js'); 


router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../resources/html_files/login.html')); 
});

router.post('/login', loginController.handleLogin);


module.exports = router;