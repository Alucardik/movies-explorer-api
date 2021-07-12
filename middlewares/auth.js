const { verify } = require('jsonwebtoken');
const NotAuthorizedError = require('./error_handling/notAuthorizedError');

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;
  const { JWT_SECRET = 'yet-another-secret-code' } = process.env;

  if (!jwt) {
    next(new NotAuthorizedError('Необходимо авторизироваться'));
    return;
  }

  let payload;

  try {
    payload = verify(jwt, JWT_SECRET);
  } catch (err) {
    next(new NotAuthorizedError('Необходимо авторизироваться'));
    return;
  }

  req.user = payload;

  next();
};
