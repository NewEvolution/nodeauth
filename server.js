'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const localPort = 3000;
const port = process.env.PORT || localPort;
const secret = process.env.SECRET || 'DevPasswordYo';

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

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  res.redirect('/');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  if (req.body.password === req.body.repassword) {
    res.redirect('/login');
  } else {
    res.render('register', {
      email: req.body.email,
      message: 'Passwords do not match'
    });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`); // eslint-disable-line no-console
});
