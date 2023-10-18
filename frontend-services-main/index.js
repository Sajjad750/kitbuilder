// server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 5001
// Increase the limit for JSON payloads
app.use(express.json({ limit: '10mb' }));  // you can adjust the size accordingly
// Express body parser to send JSON in response
app.use(express.json());
var cors = require('cors');
app.use(cors());
const home = require('./routes/home');
const preview = require('./routes/preview');
app.use('/', home);
app.use('/api/canvas-preview', preview);



// PORT Setup

app.listen(port, () => console.log(`Listening on Port ${port}...`))

