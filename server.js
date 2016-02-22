'use strict';

const express = require('express');
const localPort = 3000;
const port = process.env.PORT || localPort;

const app = express();

app.get('/', (req, res) => {
  res.send('I live, I hunger.');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`); // eslint-disable-line no-console
});
