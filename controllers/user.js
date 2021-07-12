const user = require('../models/user');

const NotFoundError = require('../middlewares/error_handling/notFoundError');
const BadRequestError = require('../middlewares/error_handling/badRequestError');
const IntervalServerError = require('../middlewares/error_handling/intervalServerError');

module.exports.getCurUser = (req, res, next) => {
  user.findById(req.user._id)
    .then((reqCard) => {
      if (reqCard) {
        return res.send(reqCard);
      }
      return Promise.reject(new NotFoundError('Запрашиваемый пользователь не найден'));
    })
    .catch((err) => {
      switch (err.name) {
        case 'CastError':
          throw new BadRequestError('Некорректный id пользователя');
        case 'NotFound':
          throw err;
        default:
          throw new IntervalServerError(err.message);
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
        return res.send(reqUser);
      }
      return Promise.reject(new NotFoundError('Запрашиваемый пользователь не найден'));
    })
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError':
          throw new BadRequestError(err.message);
        case 'CastError':
          throw new BadRequestError('Некорректный id пользователя');
        case 'NotFound':
          throw err;
        default:
          throw new IntervalServerError(err.message);
      }
    })
    .catch(next);
};
