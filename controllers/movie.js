const movie = require('../models/movie');

const NotFoundError = require('../middlewares/error_handling/notFoundError');
const ForbiddenError = require('../middlewares/error_handling/forbiddenError');
const BadRequestError = require('../middlewares/error_handling/badRequestError');
const IntervalServerError = require('../middlewares/error_handling/intervalServerError');

module.exports.getMovies = (req, res, next) => {
  movie.find({})
    .then((movies) => res.send(movies))
    .catch(() => {
      throw new IntervalServerError('Ошибка извлечения фильмов');
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((newFilm) => res.send(newFilm))
    .catch(({ name: errName, message }) => {
      switch (errName) {
        case 'ValidationError':
          throw new BadRequestError(message);
        default:
          throw new IntervalServerError(message);
      }
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const { _id } = req.user;

  movie.findById(movieId)
    .then((reqFilm) => {
      if (reqFilm) {
        if (reqFilm.owner.equals(_id)) {
          return movie.findByIdAndRemove(movieId);
        }
        return Promise.reject(new ForbiddenError('Запрошено удаление не принадлежащей вам карточки'));
      }
      return Promise.reject(new NotFoundError('Запрашиваемая карточка не найдена'));
    })
    .then((reqFilm) => {
      res.send({ reqFilm });
    })
    .catch((err) => {
      switch (err.name) {
        case 'CastError':
          throw new BadRequestError('Некорректный id фильма');
        case 'NotFound':
          throw err;
        case 'Forbidden':
          throw err;
        default:
          throw new IntervalServerError(err.message);
      }
    })
    .catch(next);
};
