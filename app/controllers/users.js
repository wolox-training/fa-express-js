const { createUser } = require('../services/users');
const _ = require('lodash');

exports.createUser = (req, res, next) =>
  createUser(req.body)
    .then(user => res.send(_.pick(user, ['name', 'last_name', 'email'])))
    .catch(next);
