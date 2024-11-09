const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const getAIAnswer = async (req, res) => {
    const { question } = req.body;

    try {
        const chatCompletion = await groq.chat.completions.create({
            "messages": [
                { "role": "system", "content": "You are an expert on graph theory. Please answer questions related to graphs." },
                { "role": "user", "content": question },
            ],
            "model": "llama-3.1-70b-versatile",
            "temperature": 1,
            "max_tokens": 1024,
            "top_p": 1,
            "stream": false,
            "stop": null
        });

    
        const aiAnswer = chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't find an answer to that.";
        res.json({ answer: aiAnswer });
    } catch (error) {
        console.error('Error with Groq API:', error);
        res.status(500).json({ answer: 'An error occurred while processing your request.' });
    }
};

module.exports = { getAIAnswer };
