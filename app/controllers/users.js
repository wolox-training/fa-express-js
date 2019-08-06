const { createUser, signInUser } = require('../services/users');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../constants');
const lodash = require('lodash');

exports.createUser = (req, res, next) =>
  createUser(req.body)
    .then(user => res.send(lodash.pick(user, ['name', 'last_name', 'email'])))
    .catch(next);

exports.signIn = (req, res, next) =>
  signInUser(req.body)
    .then(() => {
      const token = jwt.sign({ username: req.body.email }, SECRET);
      res.send({ token });
    })
    .catch(next);
