const express = require('express');
const router = express.Router();
const codeExecutionController = require('../controller/codeExecution.controller.js');

router.get('/codeExecution', codeExecutionController.getCodeExecutionPage);

module.exports = router;
