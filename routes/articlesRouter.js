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

articlesRouter.route('/').get(getArticles);

articlesRouter
  .route('/:article_id')
  .get(getArticleByID)
  .patch(patchArticleByID);

articlesRouter
  .route('/:article/comments')
  .post(postComment)
  .get(getCommentsByArticleID);

module.exports = articlesRouter;
