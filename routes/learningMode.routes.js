const express = require('express');
const router = express.Router();
const learningModeController = require('../controller/learningMode.controller.js');

router.get('/learning-mode', learningModeController.getLearningModePage);

module.exports = router;
