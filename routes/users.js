const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getCurUser, updateCurUser } = require('../controllers/user');

usersRouter.get('/me', getCurUser);
usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), updateCurUser);

module.exports.usersRouter = usersRouter;
