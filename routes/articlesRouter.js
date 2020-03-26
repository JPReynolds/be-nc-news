const articlesRouter = require('express').Router();
const {
  getArticleByID,
  patchArticleByID,
  getArticles
} = require('../controllers/articlesController');
const {
  postComment,
  getCommentsByArticleID
} = require('../controllers/commentsController');
const { handle405s } = require('../errors');

articlesRouter
  .route('/')
  .get(getArticles)
  .all(handle405s);

articlesRouter
  .route('/:article_id')
  .get(getArticleByID)
  .patch(patchArticleByID)
  .all(handle405s);

articlesRouter
  .route('/:article/comments')
  .post(postComment)
  .get(getCommentsByArticleID)
  .all(handle405s);

module.exports = articlesRouter;
