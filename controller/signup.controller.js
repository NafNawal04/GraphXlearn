const db = require('../db');

const handleSignup = async(req, res) => {
    const { name, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        return res.status(400).send('Invalid email or password.');
    }

    try {
        
        const existingUser = await db.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).send('Email already exists.');
        }

       
        await db.user.create({
            data: { name, email, password },
        });

        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred during signup.');
    }
};

module.exports = { handleSignup };
