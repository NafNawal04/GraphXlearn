require('dotenv').config();
const { OpenAI } = require('openai'); 
const { PythonShell } = require('python-shell');
const path = require('path');
const fs = require('fs');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, 
});


const getCodeExecutionPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../resources/html_files/codeExecution.html'));
};

async function analyzeCode(req, res) {
    const code = req.body.code;

    if (!code) {
        return res.status(400).json({ error: 'No code provided for analysis.' });
    }

    try {
        const response = await openai.createChatCompletion({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: "You are an AI assistant that provides suggestions to improve Python code. Suggest optimizations, error fixes, and best practices." },
                { role: 'user', content: `Analyze this Python code and provide suggestions:\n${code}` }
            ],
            temperature: 0.5,
        });

        res.json({ suggestions: response.data.choices[0].message.content });
    } catch (error) {
        console.error('AI analysis failed:', error);
        res.status(500).json({ error: 'Failed to analyze code with AI.' });
    }
}

function executeCode(req, res) {
    console.log('Received code:', req.body.code);
    const code = req.body.code;

    if (!code) {
        console.error('No code provided.');
        return res.status(400).json({ error: 'No code provided in the request.' });
    }

    const tempFile = path.join(__dirname, 'python.py');

    fs.writeFile(tempFile, code, (err) => {
        if (err) {
            console.error('Failed to save code:', err.message);
            return res.status(500).json({ error: 'Failed to save code to file.' });
        }

        console.log('Executing Python script...');

        let outputData = [];
        let errorData = [];

        const shell = new PythonShell(tempFile, { pythonOptions: ['-u'] });

        shell.on('message', (message) => {
            outputData.push(message);
        });

        shell.on('stderr', (stderr) => {
            errorData.push(stderr);
        });

        shell.end((err) => {
            let response = {
                output: outputData.join('\n'),
                error: errorData.length > 0 ? errorData.join('\n') : null,
                showGraph: false
            };

            if (code.includes("plt.show()") || code.includes("plt.savefig")) {
                response.showGraph = true;  
            }

            res.json(response);
        });
    });
}

module.exports = { analyzeCode,executeCode, getCodeExecutionPage };
