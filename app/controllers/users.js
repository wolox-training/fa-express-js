const { createUser, signInUser } = require('../services/users');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../constants');

exports.setUser = (req, res, next) =>
  createUser(req.body)
    .then(() => res.send({ message: 'User Created' }))
    .catch(next);

exports.signIn = (req, res, next) =>
  signInUser(req.body)
    .then(() => {
      const token = jwt.sign({ username: req.body.email }, SECRET);
      res.send({ token });
    })
    .catch(next);
