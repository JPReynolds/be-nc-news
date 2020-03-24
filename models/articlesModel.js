const knex = require('../db/connection');

exports.selectArticleByID = article_id => {
  return knex('articles')
    .first('*')
    .where('article_id', article_id)
    .then(article => {
      return knex('comments')
        .select('*')
        .where('article_id', article_id)
        .then(comments => {
          article.comment_count = comments.length;
          console.log(article);
          return article;
        });
    });
};
