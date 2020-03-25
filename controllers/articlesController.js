const {
  selectArticleByID,
  updateArticle,
  selectArticles
} = require('../models/articlesModel');

exports.getArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleByID(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticle(article_id, inc_votes)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;
  selectArticles(sort_by, order, author, topic)
    .then(articles => {
      console.log(articles);
      res.status(200).send({ articles });
    })
    .catch(next);
};
