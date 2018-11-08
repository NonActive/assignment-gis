const port = process.env.PORT || 3000;

const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');

const app = express()


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const distDir = path.join(__dirname, 'public');
app.use(express.static(distDir));


// app.use('/api', require('./routes/api-router').routes);

// Initialize the app.
app.listen(port, () => {
    console.log("App now running on port", port);
});