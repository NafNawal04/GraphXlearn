const path = require('path');

const getGamePage = (req, res) => {
    res.sendFile(path.join(__dirname, '../resources/html_files/gamepage.html'));
};

module.exports = { getGamePage };
