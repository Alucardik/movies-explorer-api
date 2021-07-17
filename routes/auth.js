const authRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { createUser, login } = require('../controllers/user');

authRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

authRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

module.exports.authRouter = authRouter;
