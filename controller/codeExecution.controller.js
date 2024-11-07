const path = require('path');

const getCodeExecutionPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../html_files/codeExecution.html'));
};

module.exports = { getCodeExecutionPage };