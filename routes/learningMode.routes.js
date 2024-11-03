const express = require('express');
const router = express.Router();
const learningModeController = require('../controller/learningMode.controller.js');

router.get('/learning-mode', learningModeController.getLearningModePage);
router.get('/learning-mode/:graphType', learningModeController.renderGraphContent);

module.exports = router;
