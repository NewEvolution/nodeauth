'use strict'

const express = require('express');
const router = express.Router();

const userR = require('./user');

router.use('/', userR);

module.exports = router;
