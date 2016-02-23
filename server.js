'use strict';

const express = require('express');
const favicon = require('favicon'); // eslint-disable-line no-unused-vars

const app = express();

app.set('view engine', 'jade');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const secret = process.env.SECRET || 'DevPasswordYo';
app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: true,
  store: new RedisStore()
}));

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

// Add visit information to session object
app.use((req, res, next) => {
  req.session.visits = req.session.visits || {};
  req.session.visits[req.url] = req.session.visits[req.url] || 0; // eslint-disable-line no-magic-numbers
  ++req.session.visits[req.url];
  next();
});

// Define a user if no one is logged in
app.use((req, res, next) => {
  app.locals.user = req.session.user || {email: 'Guest'};
  next();
});

const date = new Date();
app.locals.title = 'NodeAuth';
app.locals.year = date.getFullYear()

const userRoutes = require('./lib/user/routes');
app.use(userRoutes);

app.get('/', (req, res) => {
  res.render('index');
});

const mongoose = require('mongoose');
const localPort = 3000;
const localMongoPort = 27017;
const port = process.env.PORT || localPort;
const MONGO_PORT = process.env.MONGO_PORT || localMongoPort;
const MONGO_HOST = process.env.MONGO_HOST || 'localhost';
const MONGO_USER = process.env.MONGO_USER || '';
const MONGO_PASS = process.env.MONGO_PASS || '';
const MONGO_AUTH = MONGO_USER ? `${MONGO_USER}:${MONGO_PASS}@` : '';
const MONGO_URL = `mongodb://${MONGO_AUTH}${MONGO_HOST}:${MONGO_PORT}/nodeauth`;

mongoose.connect(MONGO_URL);

mongoose.connection.on('open', err => {
  if (err) throw err;
  app.listen(port, () => {
    console.log(`Listening on port ${port}`); // eslint-disable-line no-console
  })
});
