'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const localPort = 3000;
const port = process.env.PORT || localPort;

const app = express();
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: false }));

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

app.listen(port, () => {
  console.log(`Listening on port ${port}`); // eslint-disable-line no-console
});
