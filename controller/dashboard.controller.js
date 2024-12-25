const db = require('../db');

const viewProfile = async (req, res) => {
    // Access the authenticated user via req.user
    const user = req.user;

    console.log("Authenticated user:", user);

    if (!user) {
        return res.status(403).json({ error: 'User not authenticated' });
    }

    try {
        // Optionally, you can fetch fresh user data from the database
        const freshUser = await db.user.findUnique({
            where: { email: user.email },
        });

        if (freshUser) {
            console.log("User found:", freshUser);
            res.json({ name: freshUser.name, email: freshUser.email });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error("Error retrieving user profile:", error);
        res.status(500).json({ error: 'An error occurred while retrieving the profile' });
    }
};


const updateProfile = async (req, res) => {
    console.log("Updating profile...");

    const { name, email } = req.body;
    const sessionEmail = req.session.email;

    if (!sessionEmail) {
        return res.status(403).json({ error: 'User not logged in' });
    }

    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    try {
        const updatedUser = await db.user.update({
            where: { email: sessionEmail },
            data: { 
                name: name, 
                email: email 
            },
        });

        console.log("Profile updated successfully:", updatedUser);
        res.status(200).json({ 
            message: 'Profile updated successfully', 
            profile: { name: updatedUser.name, email: updatedUser.email } 
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: 'An error occurred while updating the profile' });
    }
};

module.exports = { viewProfile, updateProfile };
