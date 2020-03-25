const knex = require('../db/connection');

exports.selectArticles = (sort_by, order, author, topic) => {
  console.log(author);
  return knex('articles')
    .select('*')
    .modify(query => {
      if (author) query.where({ author });
      if (topic) query.where({ topic });
    })
    .orderBy(sort_by || 'created_at', order || 'desc');
};

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

exports.updateArticle = (article_id, inc_votes = 0) => {
  return knex('articles')
    .first('*')
    .where('article_id', article_id)
    .increment('votes', inc_votes)
    .returning('*')
    .then(([article]) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: 'article does not exist' });
      } else {
        return article;
      }
    });
};
