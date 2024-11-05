const db = require('../db');

const handleLogin = async(req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email and password
        const user = await db.user.findFirst({
            where: {
                email,
                password,
            },
        });

        if (!user) {
            return res.status(400).send('Invalid email or password.');
        }

        req.session.email = user.email;
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred during login.');
    }
};

module.exports = { handleLogin };
