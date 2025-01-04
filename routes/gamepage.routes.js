const express = require('express');
const router = express.Router();
const gamepageController = require('../controller/gamepage.controller.js');

router.get('/gamepage', gamepageController.getGamePage);

module.exports = router;
