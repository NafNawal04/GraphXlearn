const express = require('express');
const path = require('path');
const router = express.Router();
const codeExecutionController = require('../controller/codeExecution.controller.js');

router.get('/codeExecution', codeExecutionController.getCodeExecutionPage);

router.post('/code-execute', codeExecutionController.executeCode);

router.post('/ai-analyze', codeExecutionController.analyzeCode);

router.get('/graph.png', (req, res) => {
    const filePath = path.join(__dirname, '../graph.png');
    console.log('Serving graph.png from:', filePath); 
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error serving graph.png:', err.message);
            res.status(500).send('Error retrieving the graph image.');
        }
    });
});

module.exports = router;
