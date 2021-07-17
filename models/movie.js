const mongoose = require('mongoose');
const { isURL } = require('validator');

const movieSchema = mongoose.Schema({
  country: {
    required: true,
    type: String,
  },
  director: {
    required: true,
    type: String,
  },
  duration: {
    required: true,
    type: Number,
  },
  year: {
    required: true,
    type: String,
  },
  description: {
    required: true,
    type: String,
  },
  image: {
    required: true,
    type: String,
    validate: {
      validator(url) {
        return isURL(url);
      },
    },
    message: 'Пожалуйста, введите действительный URL',
  },
  trailer: {
    required: true,
    type: String,
    validate: {
      validator(url) {
        return isURL(url);
      },
    },
    message: 'Пожалуйста, введите действительный URL',
  },
  thumbnail: {
    required: true,
    type: String,
    validate: {
      validator(url) {
        return isURL(url);
      },
    },
    message: 'Пожалуйста, введите действительный URL',
  },
  owner: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
  movieId: {
    required: true,
    type: Number,
  },
  nameRU: {
    required: true,
    type: String,
  },
  nameEN: {
    required: true,
    type: String,
  },
});

module.exports = mongoose.model('movie', movieSchema);
