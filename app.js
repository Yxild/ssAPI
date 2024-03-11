const express = require('express'); // Web Handling
const helmet = require('helmet'); // Web Protection
const uuid = require('uuid'); // Script Generation

const app = express();
const port = 1234;

app.use(helmet()); // This directly adds protection between the server and some faggot
app.use(express.json());
app.use(express.static('public'))
const servers = {};

// Connects a server
app.post('/connect', (req, res) => {
    const { gameId, jobId } = req.body;
    if (!servers[gameId])
        servers[gameId] = {};

    servers[gameId][jobId] = { scripts: [] }; // init

    console.log(`${gameId} @ ${jobId} : Connected Server`);
    res.json({ success: true });
});

// Disconnects a server
app.post('/disconnect', (req, res) => {
    const { gameId, jobId } = req.body;
    delete servers[gameId][jobId];

    console.log(`${gameId} @ ${jobId} : Disconnected server`);
    res.json({ success: true });
});

// Returns the table of avaliable servers
app.get('/servers', (req, res) => {
    res.json(servers);
});

// Adds a script to the Script Queue
app.post('/runscript/', (req, res) => {
    try {
        const { gameId, jobId, script } = req.body;
        console.log(`${gameId} @ ${jobId} : Added script to script queue, encoded: ${Buffer.from(script).toString('base64')}`);

        if (servers[gameId] && servers[gameId][jobId]) {
            if (!servers[gameId][jobId].scripts) {
                servers[gameId][jobId].scripts = []; // Initialize the scripts array if it's undefined
            }
            // Append the new script to the existing scripts array
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
app.get('/check/:gameId/:jobId', (req, res) => {
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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
