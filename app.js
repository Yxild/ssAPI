const express = require('express');
const helmet = require('helmet');
const app = express();
const port = 1234;

app.use(helmet()); // This directly adds protection between the server and some faggot
app.use(express.json());
const servers = {};

// Connects a server
app.post('/connect', (req, res) => {
    const { gameId, jobId } = req.body;
    if (!servers[gameId])
        servers[gameId] = {  };

    servers[gameId][jobId] = {  };

    console.log(`${gameId} @ ${jobId} : Connected Server`);
    res.json({ success: true });
});

// Disconnects a server
app.post('/disconnect', (req, res) => {
    const { gameId, jobId } = req.body;
    delete servers[gameId][jobId];

    if (servers[gameId][1] == null)
        delete servers[gameId] // Saves space for the table

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
        console.log(`${gameId} @ ${jobId} : Added script to script queue...`);

        if (servers[gameId][jobId]) {
            servers[gameId][jobId].script = script;
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
    const { gameId, jobId } = req.params;

    const script = servers[gameId][jobId]?.script;

    if (script) {
        res.json({ success: true, script });
        delete servers[gameId][jobId].script;
    } else {
        res.json({ success: false, message: "No script available for this server." });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
