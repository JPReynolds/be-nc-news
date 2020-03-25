const { insertComment, selectComments } = require('../models/commentsModel');

exports.postComment = (req, res, next) => {
  const { username, body } = req.body;
  const { article } = req.params;
  insertComment({ author: username, body, article_id: article }).then(
    comment => {
      res.status(201).send({ comment });
    }
  );
};

exports.getCommentsByArticleID = (req, res, next) => {
  const { article } = req.params;
  const { sort_by, order } = req.query;
  selectComments(article, sort_by, order)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
