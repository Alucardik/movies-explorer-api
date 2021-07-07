const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

// const corsHandler = require('./middlewares/cors');
// const NotFoundError = require('./middlewares/error_handling/notFoundError');
// const { requestLogger, errorLogger } = require('./middlewares/logger');
// const { cardsRouter } = require('./routes/cards');
// const { usersRouter } = require('./routes/users');
// const auth = require('./middlewares/auth');

// const { createUser, login } = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();

// app.use(corsHandler);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// app.use(requestLogger);

// logging in
// app.post('/signin', celebrate({
//   body: Joi.object().keys({
//     email: Joi.string().required().email(),
//     password: Joi.string().required(),
//   }),
// }), login);

// creating new user
// app.post('/signup', celebrate({
//   body: Joi.object().keys({
//     about: Joi.string().min(2).max(30),
//     avatar: Joi.string()
//       .pattern(/^https?:\/\/(www\.)?[\w-]+\.[\w.]+\/?[\w\-.~:/?#[\]@!$&'()*+,;=]+/),
//     name: Joi.string().min(2).max(30),
//     email: Joi.string().required().email(),
//     password: Joi.string().required(),
//   }),
// }), createUser);

// app.use(auth);
// app.use('/users', usersRouter);
// app.use('/cards', cardsRouter);

app.delete('/signout', (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    path: '/',
    sameSite: 'None',
    secure: true,
  }).end();
});

// app.use(errorLogger);

// Joi error handling middleware
app.use(errors());

// handle invalid routes
app.use((req, res, next) => {
  // next(new NotFoundError('Invalid endpoint/method'));
  next(new Error('Invalid endpoint/method'));
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

app.listen(PORT, () => {
});
