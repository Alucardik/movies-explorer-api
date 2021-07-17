const indexRouter = require('express').Router();

const { moviesRouter } = require('./movies');
const { usersRouter } = require('./users');
const { authRouter } = require('./auth');
const auth = require('../middlewares/auth');

indexRouter.use('/', authRouter);

indexRouter.use(auth);

indexRouter.use('/users', usersRouter);
indexRouter.use('/movies', moviesRouter);

indexRouter.delete('/signout', (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    path: '/',
    // sameSite: 'None',
    // secure: true,
  }).end();
});

module.exports.indexRouter = indexRouter;
