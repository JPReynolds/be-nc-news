const knex = require('../db/connection');

exports.selectArticleByID = article_id => {
  return knex('articles')
    .first('*')
    .where('article_id', article_id)
    .then(article => {
      if (!article) {
        return Promise.reject({ status: 404, msg: 'article does not exist' });
      } else {
        return knex('comments')
          .select('*')
          .where('article_id', article_id)
          .then(comments => {
            article.comment_count = comments.length;
            return article;
          });
      }
    });
};

exports.updateArticle = (article_id, inc_votes) => {
  return knex
    .select('*')
    .where('article_id', article_id)
    .from('articles')
    .returning('*')
    .then(([article]) => {
      article.votes = Number(article.votes) + inc_votes;

      return article;
    });
};
