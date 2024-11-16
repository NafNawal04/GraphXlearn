const express = require('express');
const router = express.Router();
const path = require('path');
const dashboardController = require('../controller/dashboard.controller.js');

router.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../resources/html_files/dashboard.html'));
});


router.get('/dashboard/profile/data', dashboardController.viewProfile);

router.get('/dashboard/profile', (req, res) => {
    res.sendFile(path.join(__dirname, '../resources/html_files/userProfile.html'));
});

router.get('/dashboard/profile/edit', (req, res) => {
    res.sendFile(path.join(__dirname, '../resources/html_files/edit_profile.html'));
});


module.exports = router;
