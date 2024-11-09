const express = require('express');
const path = require('path');
const router = express.Router();
const { getAIAnswer } = require('../controller/prompt.controller');

router.get('/prompt', (req, res) => {
    res.sendFile(path.join(__dirname, '../html_files', 'prompt.html'));
});


router.post('/api/ask', getAIAnswer);

module.exports = router;
