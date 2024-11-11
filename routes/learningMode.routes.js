const express = require('express');
const router = express.Router();
const path = require('path');
const learningModeController = require('../controller/learningMode.controller.js');


router.get('/learning-mode', learningModeController.getLearningModePage);



router.get('/learning-mode/:graphType', (req, res, next) => {
    const { graphType } = req.params;
    
    
    if (graphType === 'bfs-exercise') {
        res.sendFile(path.join(__dirname, '../resources/exercise_html_files/bfs-exercise.html'));
    }
    else if(graphType === 'dfs-exercise1')
    {
        res.sendFile(path.join(__dirname, '../resources/exercise_html_files/dfs-exercise1.html'));
    }
    else if(graphType === 'kruskals-exercise1')
    {
        res.sendFile(path.join(__dirname, '../resources/exercise_html_files/kruskals-exercise1.html'));
    }
    else if(graphType === 'prims-exercise1')
    {
        res.sendFile(path.join(__dirname, '../resources/exercise_html_files/prims-exercise1.html'));
    }
    else if(graphType === 'dijkstra-exercise1')
    {
        res.sendFile(path.join(__dirname, '../resources/exercise_html_files/dijkstra-exercise1.html'));
    }
    else if(graphType === 'bellman-exercise1')
    {
        res.sendFile(path.join(__dirname, '../resources/exercise_html_files/bellman-exercise1.html'));
    }
    else {
        
        learningModeController.renderGraphContent(req, res);
    }
});

module.exports = router;
