'use strict';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const userRoutes = require('./lib/user/routes');

const localPort = 3000;
const localMongoPort = 27017;
const port = process.env.PORT || localPort;
const secret = process.env.SECRET || 'DevPasswordYo';
const MONGO_PORT = process.env.MONGO_PORT || localMongoPort;
const MONGO_HOST = process.env.MONGO_HOST || 'localhost';
const MONGO_USER = process.env.MONGO_USER || '';
const MONGO_PASS = process.env.MONGO_PASS || '';
const MONGO_AUTH = MONGO_USER ? `${MONGO_USER}:${MONGO_PASS}@` : '';
const MONGO_URL = `mongodb://${MONGO_AUTH}${MONGO_HOST}:${MONGO_PORT}/nodeauth`;

const app = express();
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: secret,
  store: new RedisStore()
}));
app.use((req, res, next) => {
  req.session.visits = req.session.visits || {};
  req.session.visits[req.url] = req.session.visits[req.url] || 0; // eslint-disable-line no-magic-numbers
  ++req.session.visits[req.url];
  console.log(req.session); // eslint-disable-line no-console
  next();
});

const date = new Date();
app.locals.title = 'NodeAuth';
app.locals.year = date.getFullYear()

app.use(userRoutes);

app.get('/', (req, res) => {
  res.render('index');
});

mongoose.connect(MONGO_URL);

mongoose.connection.on('open', err => {
  if (err) throw err;
  app.listen(port, () => {
    console.log(`Listening on port ${port}`); // eslint-disable-line no-console
  })
});
