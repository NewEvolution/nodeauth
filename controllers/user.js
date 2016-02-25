'use strict';

const passport = require('passport');
const User = require('../models/user');

require('../lib/local');

module.exports.index = (req, res) => {
  res.render('login');
};

module.exports.login = passport.authenticate('local', {
  successRedirect: '/',
  failureFlash: 'Email or password incorrect',
  failureRedirect: '/login'
});

module.exports.delete = (req, res) => {
  req.session.regenerate(err => {
    if (err) throw err;
    res.redirect('/');
  });
};

module.exports.register = (req, res) => {
  res.render('register');
};

module.exports.new = (req, res) => {
  if (req.body.password === req.body.repassword) {
    User.findOne({email: req.body.email}, (err, user) => {
      if (err) throw err;
      if (user) {
        res.redirect('/login');
      } else {
        User.create(req.body, err => {
          if (err) throw err;
          res.redirect('/login');
        });
      }
    });
  } else {
    res.render('register', {
      email: req.body.email,
      message: 'Passwords do not match'
    });
  }
};

