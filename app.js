const express = require('express');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
};

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { indexRouter } = require('./routes/index');
// const { moviesRouter } = require('./routes/movies');
// const { usersRouter } = require('./routes/users');
// const auth = require('./middlewares/auth');

// const { createUser, login } = require('./controllers/user');

const { PORT = 3000 } = process.env;

const app = express();

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger);

app.use('/', indexRouter);

// app.post('/signin', celebrate({
//   body: Joi.object().keys({
//     email: Joi.string().required().email(),
//     password: Joi.string().required(),
//   }),
// }), login);
//
// app.post('/signup', celebrate({
//   body: Joi.object().keys({
//     name: Joi.string().min(2).max(30),
//     email: Joi.string().required().email(),
//     password: Joi.string().required(),
//   }),
// }), createUser);

// app.use(auth);
// app.use('/users', usersRouter);
// app.use('/movies', moviesRouter);

// app.delete('/signout', (req, res) => {
//   res.clearCookie('jwt', {
//     httpOnly: true,
//     path: '/',
//     // sameSite: 'None',
//     // secure: true,
//   }).end();
// });

// Joi error handling middleware
app.use(errors());

// handle invalid routes
app.use((req, res, next) => {
  next(new Error('Invalid endpoint/method'));
});

app.use(errorLogger);

mongoose.connect('mongodb://localhost:27017/movie-explorer-db', {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = false } = err;
  res.status(statusCode).send({
    message: message || 'На сервере произошла ошибка',
  });
  next();
});

app.listen(PORT, () => {
});
