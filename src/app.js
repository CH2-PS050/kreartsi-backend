const express = require('express');
const cors = require('cors');

const app = express();

var corsOptions = {
    origin: '*',
    credentials:true,
    optionsSuccessStatus: 200
};

app.use(express.json());
app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send('Hello, Express!');
  });

module.exports = app