const express = require('express');
const path = require('path');
const router = express.Router();
const codeExecutionController = require('../controller/codeExecution.controller.js');

// Route to serve the code execution page
router.get('/codeExecution', codeExecutionController.getCodeExecutionPage);

// Route to execute Python code
router.post('/api/code-execute', codeExecutionController.executeCode);

// Route to serve graph.png
router.get('/graph.png', (req, res) => {
    const filePath = path.join(__dirname, '../../graph.png'); 
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err.message);
            res.status(500).send('File not found');
        }
    });
});

module.exports = router;
