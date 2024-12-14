


const { exec } = require('child_process');
const { PythonShell } = require('python-shell');
const path = require('path');
const fs = require('fs');

// Function to check if `networkx` is installed and install it if necessary
function installPackages() {
    return new Promise((resolve, reject) => {
        exec('pip show networkx', (error, stdout, stderr) => {
            if (error || stderr) {
                // If networkx is not installed, install it
                exec('pip install networkx', (err, stdout, stderr) => {
                    if (err || stderr) {
                        reject(new Error('Failed to install networkx'));
                    } else {
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
    });
}

function runPythonCode(code, res) {
    const tempFile = path.join(__dirname, 'temp_code.py');

    // Save the code to a temporary Python file
    fs.writeFile(tempFile, code, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to save code' });
        }

        PythonShell.run(tempFile, null, (err, result) => {
            if (err) {
                console.error('Error running Python script:', err.message);
                res.status(500).json({ error: 'Error running Python code', details: err.message });
            } else {
                console.log('Python script executed successfully. Output:', result);
                res.json({
                    output: result ? result.join('\n') : 'No output',
                    imagePath: '/graph.png', // Correct path to the root directory
                });
            }
        });
    });
}


const getCodeExecutionPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../resources/html_files/codeExecution.html'));
};


// Controller function for executing code
async function executeCode(req, res) {
    const { code } = req.body;
    console.log('Received code:', code); // Log the received code
    
    try {
        await installPackages(); // Install dependencies
        runPythonCode(code, res);
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ error: 'Failed to install dependencies' });
    }
}


module.exports = {
    executeCode,getCodeExecutionPage
};
