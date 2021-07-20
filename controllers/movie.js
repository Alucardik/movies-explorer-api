const movie = require('../models/movie');

const NotFoundError = require('../middlewares/error_handling/notFoundError');
const ForbiddenError = require('../middlewares/error_handling/forbiddenError');
const BadRequestError = require('../middlewares/error_handling/badRequestError');

module.exports.getMovies = (req, res, next) => {
  movie.find({})
    .then((movies) => res.send(movies))
    .catch(() => {
      throw new Error('Ошибка извлечения фильмов');
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
          throw new Error(message);
      }
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const { _id } = req.user;

  movie.findOne({ movieId })
    .then((reqFilm) => {
      if (reqFilm) {
        if (reqFilm.owner.equals(_id)) {
          return reqFilm.remove();
        }
        return Promise.reject(new ForbiddenError('Запрошено удаление не принадлежащего вам фильма'));
      }
      return Promise.reject(new NotFoundError('Запрашиваемый фильм не найден'));
    })
    .then((reqFilm) => {
      res.send({ reqFilm });
    })
    .catch((err) => {
      switch (err.name) {
        case 'CastError':
          throw new BadRequestError('Некорректный id фильма');
        default:
          throw err;
      }
    })
    .catch(next);
};
