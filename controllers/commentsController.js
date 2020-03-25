const { insertComment, selectComments } = require('../models/commentsModel');

exports.postComment = (req, res, next) => {
  const comment = req.body;
  const { article } = req.params;
  insertComment(comment, article).then(comment => {
    res.status(201).send({ comment });
  });
};

exports.getCommentsByArticleID = (req, res, next) => {
  const { article } = req.params;
  selectComments(article).then(comments => {
    res.status(200).send({ comments });
  });
};
