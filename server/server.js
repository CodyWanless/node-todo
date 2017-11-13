require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const _ = require('lodash');

const { mongoose } = require('./db/mongoose');
const { authenticate } = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

require('./services/todo')(app, authenticate);
require('./services/user')(app, authenticate);

app.listen(port, () => {
	console.log(`Started on port ${port}`);
});

module.exports = { app };
