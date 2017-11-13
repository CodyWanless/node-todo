require('./config/config.ts');

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as _ from 'lodash';

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

export { app };
