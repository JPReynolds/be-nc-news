const articlesRouter = require('express').Router();
const { getArticleByID } = require('../controllers/articlesController');

articlesRouter.route('/:article_id').get(getArticleByID);

module.exports = articlesRouter;
