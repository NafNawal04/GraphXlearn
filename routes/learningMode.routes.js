

const express = require('express');
const router = express.Router();
const path = require('path');
const learningModeController = require('../controller/learningMode.controller.js');


router.get('/learning-mode', learningModeController.getLearningModePage);


router.get('/learning-mode/:graphType', (req, res, next) => {
    const { graphType } = req.params;
    
    
    if (graphType === 'bfs-exercise') {
        res.sendFile(path.join(__dirname, '../exercise_html_files/bfs-exercise.html'));
    } else {
        
        learningModeController.renderGraphContent(req, res);
    }
});

module.exports = router;
