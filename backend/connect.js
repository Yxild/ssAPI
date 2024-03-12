const express = require('express');
const router = express.Router();
const servers = require('./servers');

// Connects a server
router.post('/connect', (req, res) => {
    try {
        const { gameId, jobId } = req.body;
        if (!servers[gameId])
            servers[gameId] = [];

        servers[gameId][jobId] = { scripts: [] }; // init

        console.log(`${gameId} @ ${jobId} : Connected Server`);
        res.json({ success: true });
    } catch (error) {
        console.error('Error parsing JSON data:', error);
        res.status(400).json({ success: false, error: 'Invalid JSON data' });
    }
});

// Disconnects a server
router.post('/disconnect', (req, res) => {
    try {
        const { gameId, jobId } = req.body;
        const Counter = 0;

        delete servers[gameId][jobId];

        for (const job of servers) {
            if (job != nil)
                Counter += 1
        }

        if (Counter == 0)
            delete servers[gameId];

        console.log(`${gameId} @ ${jobId} : Disconnected server`);
        res.json({ success: true });
    } catch (error) {
        console.error('Error parsing JSON data:', error);
        res.status(400).json({ success: false, error: 'Invalid JSON data' });
    }
});

module.exports = router;