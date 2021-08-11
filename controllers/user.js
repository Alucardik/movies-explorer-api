const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const user = require('../models/user');

const NotFoundError = require('../middlewares/error_handling/notFoundError');
const BadRequestError = require('../middlewares/error_handling/badRequestError');
const DuplicateMailError = require('../middlewares/error_handling/duplicateMailError');
const NotAuthorizedError = require('../middlewares/error_handling/notAuthorizedError');

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => user.create({
      name, email, password: hash,
    }))
    .then((reqUser) => res.send({
      name: reqUser.name,
      email: reqUser.email,
    }))
    .catch(({ name: errName, message, code }) => {
      switch (errName) {
        case 'ValidationError':
          throw new BadRequestError(message);
        case 'MongoError':
          if (code === 11000) {
            throw new DuplicateMailError('Пользователь с таким email уже зарегистрирован');
          }
          throw new Error('Ошибка базы данных');
        default:
          throw new Error(message);
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  let JWT_SECRET;
  const { NODE_ENV } = process.env;
  if (NODE_ENV !== 'production') {
    JWT_SECRET = 'yet-another-secret-code';
  } else {
    JWT_SECRET = process.env.JWT_SECRET;
  }

  return user.findUserByCredentials(email, password)
    .then((newUser) => {
      const token = jwt.sign({ _id: newUser._id },
        JWT_SECRET,
        { expiresIn: '3d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 3,
        httpOnly: true,
        path: '/',
        sameSite: 'None',
        secure: true,
      })
        .end();
    })
    .catch((err) => {
      throw new NotAuthorizedError(err.message);
    })
    .catch(next);
};

module.exports.getCurUser = (req, res, next) => {
  user.findById(req.user._id)
    .then((reqUser) => {
      if (reqUser) {
        return res.send({ name: reqUser.name, email: reqUser.email });
      }
      return Promise.reject(new NotFoundError('Запрашиваемый пользователь не найден'));
    })
    .catch((err) => {
      switch (err.name) {
        case 'CastError':
          throw new BadRequestError('Некорректный id пользователя');
        default:
          throw err;
      }
    })
    .catch(next);
};

module.exports.updateCurUser = (req, res, next) => {
  const { name, email } = req.body;
  user.findByIdAndUpdate(req.user._id, { email, name },
    {
      new: true,
      runValidators: true,
    })
    .then((reqUser) => {
      if (reqUser) {
        return res.send({ email: reqUser.email, name: reqUser.name });
      }
      return Promise.reject(new NotFoundError('Запрашиваемый пользователь не найден'));
    })
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError':
          throw new BadRequestError(err.message);
        case 'CastError':
          throw new BadRequestError('Некорректный id пользователя');
        default:
          throw err;
      }
    })
    .catch(next);
};
