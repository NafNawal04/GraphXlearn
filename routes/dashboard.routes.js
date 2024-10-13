const express = require('express');
const router = express.Router();
const path = require('path');
const dashboardController = require('../controller/dashboard.controller');

router.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../html_files/dashboard.html'));
});


router.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, '../html_files/userProfile.html'));
});

router.post('/profile', dashboardController.viewProfile);

module.exports = router;
