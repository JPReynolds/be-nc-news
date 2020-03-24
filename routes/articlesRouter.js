const articlesRouter = require('express').Router();
const {
  getArticleByID,
  patchArticleByID
} = require('../controllers/articlesController');

articlesRouter
  .route('/:article_id')
  .get(getArticleByID)
  .patch(patchArticleByID);

module.exports = articlesRouter;
