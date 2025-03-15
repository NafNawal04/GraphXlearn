const express = require('express');
const path = require('path');
const router = express.Router();
const { getAIAnswer ,getUserHistory } = require('../controller/prompt.controller');

router.get('/prompt', (req, res) => {
    res.sendFile(path.join(__dirname, '../resources/html_files', 'prompt.html'));
});


router.post('/api/ask', getAIAnswer);
router.get('/api/history', getUserHistory);

module.exports = router;
