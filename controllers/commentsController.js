const { insertComment, selectComments } = require('../models/commentsModel');
const { checkArticleExists } = require('../models/articlesModel');

exports.postComment = (req, res, next) => {
  const { username, body } = req.body;
  const { article } = req.params;
  insertComment({ author: username, body, article_id: article })
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getCommentsByArticleID = (req, res, next) => {
  const { article } = req.params;
  const { sort_by, order } = req.query;

  Promise.all([
    selectComments(article, sort_by, order),
    checkArticleExists(article)
  ])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
