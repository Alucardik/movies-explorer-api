const moviesRouter = require('express').Router();

const { getMovies, createMovie, deleteMovie } = require('../controllers/movie');

moviesRouter.get('/', getMovies);
moviesRouter.post('/', createMovie);
moviesRouter.delete('/:movieId', deleteMovie);

module.exports.moviesRouter = moviesRouter;
