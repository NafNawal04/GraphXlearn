require('dotenv').config();
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const { PythonShell } = require('python-shell');
const path = require('path');
const fs = require('fs');


const getCodeExecutionPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../resources/html_files/codeExecution.html'));
};

async function analyzeCode(req, res) {
    const { code, error } = req.body;

    if (!code) {
        console.error('No code provided for analysis.');
        return res.status(400).json({ error: 'No code provided for analysis.' });
    }

    try {
        console.log('Sending code for analysis using Groq SDK:', code);
        const analysisResponse = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',  
            temperature: 0.7,
            max_tokens: 1024,
            messages: [
                { role: 'system', content: 'You are an expert in Python. Analyze the error and suggest fixes.' },
                { role: 'user', content: `Error: ${error}. Suggest a fix for this code:\n\n${code}` }
            ]
        });

        const aiAnalysis =
            analysisResponse.choices[0]?.message?.content || "No analysis available.";


        res.json({ suggestions: aiAnalysis });

    } catch (error) {
        console.error('Error during AI analysis using Groq SDK:', error);
        res.status(500).json({ error: 'Failed to analyze code with Groq.' });
    }
}

async function executeCode(req, res) {
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
