const knex = require('../db/connection');

exports.selectArticleByID = article_id => {
  return knex('articles')
    .first('*')
    .where('article_id', article_id);
  // .then(article => console.log(article));
};
