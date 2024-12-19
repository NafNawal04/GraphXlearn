const express = require('express');
const path = require('path');
const router = express.Router();
const codeExecutionController = require('../controller/codeExecution.controller.js');

// Route to serve the code execution page
router.get('/codeExecution', codeExecutionController.getCodeExecutionPage);

// Route to execute Python code
router.post('/code-execute', codeExecutionController.executeCode);

router.get('/graph.png', (req, res) => {
    const filePath = path.join(__dirname, '../graph.png'); // Adjusted path to serve the graph image correctly
    console.log('Serving graph.png from path:', filePath); // Log to debug the file location
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error serving graph.png:', err.message);
            res.status(500).send('Error retrieving the graph image.');
        }
    });
});

module.exports = router;
