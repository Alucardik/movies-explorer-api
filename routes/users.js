const usersRouter = require('express').Router();
const { getCurUser, updateCurUser } = require('../controllers/user');

usersRouter.get('/me', getCurUser);
usersRouter.patch('/me', updateCurUser);

module.exports.usersRouter = usersRouter;
