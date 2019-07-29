const { setUser } = require('../services/users');

exports.setUser = (req, res, next) =>
  setUser(req.body)
    .then(() => res.send('User Created'))
    .catch(next);
