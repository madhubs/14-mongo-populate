'use strict';

require('dotenv').config();
const debug = require('debug')('http:server');

// express setup
const express = require('express');
const router = express.Router();
const app = express();

// mongoose setup
const mongoose = require('mongoose');
// const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/toy-dev'
mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true}); //pulled in through the env variables set on that process

// middleware
// const bodyParser = require('body-parser').json();
const cors = require('cors');
// const errorMiddleware = require('./error-middleware');

// routes (middleware as well, becuaes we are attachign the routes to the router....)
require('../route/route-toy')(router);
require('../route/route-child')(router);
// require('../route/route-family')(router)

// mount middleware
app.use(require('body-parser').json());
app.use(cors());
app.use(router)
// this should always be last to catch any errors within the callback chain
// app.use(errorMiddleware)

app.all('/*', (req, res) => res.sendStatus(404)); //catch all. for any http request method to a route that does not exist pass it off to this 404 response.

module.exports = app; //

//within each test file we can explicitely start and stop a server instance. Is the following only necessary if we seperate the tests into their own modules. See code review
