const { selectArticleByID } = require('../models/articlesModel');

exports.getArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleByID(article_id).then(article => {
    res.status(200).send({ article });
  });
};
