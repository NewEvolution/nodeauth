'use strict';

const express = require('express');
const router = express.Router();

const userC = require('../controllers/user');

require('../lib/local');

module.exports = router.get('/login', userC.index)
  .post('/login', userC.login)
  .delete('/login', userC.delete)
  .get('/register', userC.register)
  .post('/register', userC.new);

