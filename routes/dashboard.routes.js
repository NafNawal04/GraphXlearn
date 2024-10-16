const express = require('express');
const router = express.Router();
const path = require('path');
const dashboardController = require('../controller/dashboard.controller.js');

router.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../html_files/dashboard.html'));
});


router.get('/dashboard/profile', (req, res) => {
    res.sendFile(path.join(__dirname, '../html_files/userProfile.html'));
});

router.post('/dashboard/profile', dashboardController.viewProfile);

module.exports = router;
