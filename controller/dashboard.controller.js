const db = require('../db');

const viewProfile = async (req, res) => {
    const user = req.user;

    console.log("Authenticated user:", user);

    if (!user) {
        return res.status(403).json({ error: 'User not authenticated' });
    }

    try {

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
    const sessionId = req.session?.passport?.user; // The session stores the user ID

    if (!sessionId) {
        console.error("Error: User not logged in.");
        return res.status(403).json({ error: "User not logged in" });
    }

    if (!name || !email) {
        console.error("Error: Name and email are required.");
        return res.status(400).json({ error: "Name and email are required" });
    }

    if (!email.includes("@")) {
        console.error("Error: Invalid email format.");
        return res.status(400).json({ error: "Invalid email format" });
    }

    try {
        console.log("Updating user with session ID:", sessionId);

        const existingUser = await db.user.findUnique({
            where: { id: sessionId }, 
        });


        if (!existingUser) {
            console.error("Error: User not found in the database.");
            return res.status(404).json({ error: "User not found" });
        }


        const updatedUser = await db.user.update({
            where: { id: sessionId }, 
            data: { 
                name: name.trim(),
                email: email.trim(),
            },
        });

        console.log("Profile updated successfully:", updatedUser);

        return res.status(200).json({ 
            message: "Profile updated successfully", 
            profile: { name: updatedUser.name, email: updatedUser.email },
        });
    } catch (error) {
        console.error("Error updating profile:", error);

        if (error.code === "P2025") { 
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(500).json({ error: "An error occurred while updating the profile" });
    }
};


module.exports = { viewProfile, updateProfile };
