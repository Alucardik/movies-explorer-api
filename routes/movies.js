const moviesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { isURL } = require('validator');

const { getMovies, createMovie, deleteMovie } = require('../controllers/movie');

moviesRouter.get('/', getMovies);
moviesRouter.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value, helpers) => {
      if (isURL(value)) {
        return value;
      }

      return helpers.message('Введите корректный адрес изображения');
    }),
    trailer: Joi.string().required().custom((value, helpers) => {
      if (isURL(value)) {
        return value;
      }

      return helpers.message('Введите корректный адрес трейлера');
    }),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (isURL(value)) {
        return value;
      }

      return helpers.message('Введите корректный адрес превью');
    }),
    movieId: Joi.number().integer().required(),
  }),
}), createMovie);
moviesRouter.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.number().integer(),
  }),
}), deleteMovie);

module.exports.moviesRouter = moviesRouter;
