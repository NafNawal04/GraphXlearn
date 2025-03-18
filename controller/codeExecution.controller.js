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


module.exports = { analyzeCode,executeCode, getCodeExecutionPage };
