const knex = require('../db/connection');

exports.selectArticleByID = (article_id, inc_votes) => {
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
    })
    .then(article => {
      if (inc_votes) {
        return knex('articles')
          .where('article_id', article_id)
          .increment('votes', inc_votes)
          .returning('*');
      } else {
        return article;
      }
    });
};

// exports.updateArticle = (article_id, inc_votes) => {
//   return knex('articles')
//     .where('article_id', article_id)
//     .increment('votes', inc_votes)
//     .returning('*');
// };
