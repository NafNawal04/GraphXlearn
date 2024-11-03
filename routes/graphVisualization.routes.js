const express = require('express');
const router = express.Router();
const graphVisualizationController = require('../controller/graphVisualization.controller.js');

router.get('/graph-visualization', graphVisualizationController.getGraphVisualizationPage);

module.exports = router;
