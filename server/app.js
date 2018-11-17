const port = process.env.PORT || 3000;

const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const routes = require('./routes/api-router');

const app = express()

// Set-up logger
const logStream = fs.createWriteStream(path.join(__dirname, 'logs', 'morgan.log'), { flags: 'a' })
app.use(morgan('common', { stream: logStream }))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const distDir = path.join(__dirname, 'public');
app.use(express.static(distDir));

app.use('/api', routes);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Initialize the app.
app.listen(port, () => {
    console.log("App now running on port", port);
});