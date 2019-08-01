const { createUser } = require('../services/users');

exports.createUser = (req, res, next) =>
  createUser(req.body)
    .then(() => res.send({ message: 'User Created' }))
    .catch(next);
