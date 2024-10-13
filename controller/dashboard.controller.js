const fs = require('fs');
const path = require('path');
const usersFilePath = path.join(__dirname, '../info/userInfo.txt');

const viewProfile = (req, res) => {
    console.log("Session email:", req.session.email); 

    const email = req.session.email; 

    if (!email) {
        return res.status(403).json({ error: 'User not logged in' });
    }

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) throw err;
        const users = data ? JSON.parse(data) : [];
        const user = users.find(user => user.email === email);

        if (user) {
            console.log("User found:", user); 
            res.json({ name: user.name, email: user.email });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });
};

module.exports = { viewProfile };
