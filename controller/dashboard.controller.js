const db = require('../db');

const viewProfile = async(req, res) => {
    console.log("Session email:", req.session.email); 

    const email = req.session.email; 

    if (!email) {
        return res.status(403).json({ error: 'User not logged in' });
    }

    try {
        // Query the database for the user by email
        const user = await db.user.findUnique({
            where: { email },
        });

        if (user) {
            console.log("User found:", user);
            res.json({ name: user.name, email: user.email });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error("Error retrieving user profile:", error);
        res.status(500).json({ error: 'An error occurred while retrieving the profile' });
    }
};


module.exports = { viewProfile};
