const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const db = require('../db');
const { ObjectId } = require('mongodb');

const getAIAnswer = async (req, res) => {
    const { question} = req.body;
    let userId = req.session.userId || req.session.passport?.user;

    try {
        
        if (!userId || !ObjectId.isValid(userId)) {
            return res.status(400).json({ answer: "Invalid User ID format." });
        }
        
        const userObjectId = new ObjectId(userId.toString());

        
        const userHistory = await db.question.findMany({
            where: { userId: userObjectId.toString() },
            orderBy: { createdAt: 'asc' },
            select: { question: true, answer: true },
          });


        const messages = [
            { role: "system", content: "You are an expert on graph theory. Please answer questions related to graphs." },
            ...userHistory.map(entry => ({ role: "user", content: entry.question })),
            { role: "user", content: question }
          ];

        const chatCompletion = await groq.chat.completions.create({
            "messages": messages,
            "model": "llama-3.3-70b-versatile",
            "temperature": 1,
            "max_tokens": 1024,
            "top_p": 1,
            "stream": false,
            "stop": null
        });

    
        const aiAnswer = chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't find an answer to that.";
        
        await db.question.create({
            data: {
              question,
              answer: aiAnswer,
              userId: userObjectId.toString()
            }
          });
          
        res.json({ answer: aiAnswer, history: userHistory });
    } catch (error) {
        console.error('Error with Groq API:', error);
        res.status(500).json({ answer: 'An error occurred while processing your request.' });
    }
};

const getUserHistory = async (req, res) => {
    try {
        const userId = req.session.userId || req.session.passport?.user;

        if (!userId || !ObjectId.isValid(userId)) {
            return res.status(400).json({ history: [], message: "Invalid or missing User ID. Please log in again." });
        }

        const userObjectId = new ObjectId(userId.toString());

        const userHistory = await db.question.findMany({
            where: { userId: userObjectId.toString() },
            orderBy: { createdAt: 'asc' },
            select: { question: true, answer: true },
        });

        res.json({ history: userHistory });
    } catch (error) {
        console.error("Error fetching user history:", error);
        res.status(500).json({ history: [], message: "An error occurred while retrieving history." });
    }
};


module.exports = { getAIAnswer,getUserHistory };
