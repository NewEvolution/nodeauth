'use strict';

const express = require('express');
const localPort = 3000;
const port = process.env.PORT || localPort;

const app = express();

const date = new Date();
app.locals.title = 'NodeAuth';
app.locals.year = date.getFullYear()

app.set('view engine', 'jade');

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`); // eslint-disable-line no-console
});
