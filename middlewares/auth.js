const { verify } = require('jsonwebtoken');
const NotAuthorizedError = require('./error_handling/notAuthorizedError');

let JWT_SECRET;
const { NODE_ENV } = process.env;
if (NODE_ENV !== 'production') {
  JWT_SECRET = 'yet-another-secret-code';
} else {
  JWT_SECRET = process.env.JWT_SECRET;
}

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;

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
