const { PythonShell } = require('python-shell');
const path = require('path');
const fs = require('fs');




const getCodeExecutionPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../resources/html_files/codeExecution.html'));
};


function executeCode(req, res) {
    console.log('Received code:', req.body.code); 
    const code = req.body.code;

    if (!code) {
        console.error('No code provided.');
        return res.status(400).json({ error: 'No code provided in the request.' });
    }

    const tempFile = path.join(__dirname, 'python.py'); 
    // Write the code to a temporary Python file
    fs.writeFile(tempFile, code, (err) => {
        if (err) {
            console.error('Failed to save code:', err.message);
            return res.status(500).json({ error: 'Failed to save code to file.' });
        }

        console.log('Executing Python script...');
        // Run the Python script
        PythonShell.run(tempFile, null, (err, result) => {
            if (err) {
                console.error('Error executing Python script:', err.message);
                return res.status(500).json({
                    error: 'Python script execution failed.',
                    details: err.message,
                });
            }
        
            console.log('Python script executed successfully:', result);
        
            // Respond with success without waiting for further action
            res.json({ output: 'Graph generated successfully' });
        });
        
    });
}



module.exports = {
    executeCode, getCodeExecutionPage
};
