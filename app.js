const express = require('express'); // Web Handling
const helmet = require('helmet'); // Web Protection

// Backend Paths
const connect = require('./backend/connect');
const api = require('./backend/api');

const app = express();
const port = 1234;

app.use(helmet());
app.use(express.json());

// Web Service
app.use('/', connect);
app.use('/', api);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});