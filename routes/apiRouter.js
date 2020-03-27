const apiRouter = require('express').Router();
const topicsRouter = require('../routes/topicsRouter');
const usersRouter = require('../routes/usersRouter');
const articlesRouter = require('../routes/articlesRouter');
const commentsRouter = require('../routes/commentsRouter');
const { getEndpoints } = require('../controllers/apiController');
const { handle405s } = require('../errors');

apiRouter
  .route('/')
  .get(getEndpoints)
  .all(handle405s);

apiRouter.use('/topics', topicsRouter);

apiRouter.use('/users', usersRouter);

apiRouter.use('/articles', articlesRouter);

apiRouter.use('/comments', commentsRouter);

module.exports = apiRouter;
