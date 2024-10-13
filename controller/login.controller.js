const fs = require('fs');
const path = require('path');
const usersFilePath = path.join(__dirname, '../info/userInfo.txt');

const handleLogin = (req, res) => {
    const { email, password } = req.body;

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) throw err;
        const users = data ? JSON.parse(data) : [];

        const user = users.find(user => user.email === email && user.password === password);
        if (!user) {
            return res.status(400).send('Invalid email or password.');
        }

        req.session.email = user.email; 
        res.redirect('/dashboard');
    });
};

module.exports = { handleLogin };
