const fs = require('fs');
const path = require('path');
const usersFilePath = path.join(__dirname, '../info/userInfo.txt');

const viewProfile = (req, res) => {
    const email = req.body.email; 

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) throw err;
        const users = data ? JSON.parse(data) : [];
        const user = users.find(user => user.email === email);

        if (user) {
            res.json({ name: user.name, email: user.email });
        } else {
            res.status(404).send('User not found.');
        }
    });
};

module.exports = { viewProfile };
