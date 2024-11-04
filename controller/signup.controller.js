const fs = require('fs');
const path = require('path');
const usersFilePath = path.join(__dirname, '../info/userInfo.txt');

const handleSignup = (req, res) => {
    const { name, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        return res.status(400).send('Invalid email or password.');
    }

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) throw err;
        const users = data ? JSON.parse(data) : [];
        if (users.some(user => user.email === email)) {
            return res.status(400).send('Email already exists.');
        }

        users.push({ name, email, password });
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) throw err;
            res.redirect('/login');
        });
    });
};

module.exports = { handleSignup };
