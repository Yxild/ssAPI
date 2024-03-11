const express = require('express');
const helmet = require('helmet');
const app = express();
const port = 1234;

app.use(helmet()); // This directly adds protection between the server and some faggot
app.use(express.json());
const Servers = {};

app.use((req, res, next) => {
    console.log(`Incoming ${req.method} request to ${req.originalUrl}:`, req.body);
    next();
});

// Connects a server
app.post('/connect', (req, res) => {
    const { id } = req.body;
    Servers[id] = {};

    res.json({ success: true });
});

// Disconnects a server
app.post('/disconnect', (req, res) => {
    const { id } = req.body;
    console.log(`Disconnected server: ${id}`);
    delete Servers[id];

    res.json({ success: true });
});

// Returns the table of avaliable servers
app.get('/servers', (req, res) => {
    res.json(Servers);
});

// Adds a script to the Script Queue
app.post('/runscript/', (req, res) => {
    try {
        const { serverId, script } = req.body;

        if (Servers[serverId]) {
            console.log(`Running script on server ${serverId}:`, script);
            Servers[serverId].script = script;
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
app.get('/check/:serverId', (req, res) => {
    const { serverId } = req.params;

    const script = Servers[serverId]?.script;
    console.log(script);
    console.log(Servers[serverId]?.script);

    if (script) {
        res.json({ success: true, script });
        delete Servers[serverId].script;
    } else {
        res.json({ success: false, message: "No script available for this server." });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
