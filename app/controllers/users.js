const { createUser } = require('../services/users');

exports.createUser = (req, res, next) =>
  createUser(req.body)
    .then(user => res.send({ name: user.name, last_name: user.last_name, email: user.email }))
    .catch(next);
