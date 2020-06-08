const {
  selectArticleByID,
  updateArticle,
  selectArticles,
} = require('../models/articlesModel');

const { checkAuthorExists } = require('../models/usersModel');
const { checkTopicExists } = require('../models/topicsModel');

exports.getArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleByID(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticle(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;
  Promise.all([
    selectArticles(sort_by, order, author, topic),
    checkAuthorExists(author),
    checkTopicExists(topic),
  ])
    .then(([articles]) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
