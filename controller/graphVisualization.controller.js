const path = require('path');

const getGraphVisualizationPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../html_files/graphVisualization.html'));
};

module.exports = { getGraphVisualizationPage };
