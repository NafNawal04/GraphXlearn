const path = require('path');

const getLearningModePage = (req, res) => {
    res.sendFile(path.join(__dirname, '../html_files/learningMode.html'));
};

module.exports = { getLearningModePage };
