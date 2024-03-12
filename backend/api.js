const express = require('express');
const router = express.Router();
const servers = require('./servers');

// Adds a script to the Script Queue
router.post('/runscript/', (req, res) => {
    try {
        const { gameId, jobId, script } = req.body;
        console.log(`${gameId} : Added script to script queue, encoded: ${Buffer.from(script).toString('base64')}`);

        if (servers[gameId] && servers[gameId][jobId]) {
            if (!servers[gameId][jobId].scripts) {
                servers[gameId][jobId].scripts = [];
            }

            servers[gameId][jobId].scripts.push(Buffer.from(script).toString('base64'));
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Server not found' });
        }
    } catch (error) {
        console.error('Error parsing JSON data:', error);
        res.status(400).json({ success: false, error: 'Invalid JSON data' });
    }
});

// Backend check for the Script Queue
router.get('/check/:gameId/:jobId', (req, res) => {
    try {
        const { gameId, jobId } = req.params;
        const scripts = servers[gameId][jobId]?.scripts;

        if (scripts) {
            if (servers[gameId][jobId]) {
                res.json({ success: true, scripts });
                delete servers[gameId][jobId].scripts;
            } else {
                res.json({ success: false, message: 'Server not found' });
            }
        } else {
            res.json({ success: false, message: 'Script not found' });
        }
    } catch (error) {
        console.error('Error parsing JSON data:', error);
        res.status(400).json({ success: false, error: 'Invalid JSON data' });
    }
});

// Returns the table of avaliable servers
router.get('/servers', (req, res) => {
    res.json(servers);
});

module.exports = router;