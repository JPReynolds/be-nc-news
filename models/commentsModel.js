const knex = require('../db/connection');

exports.insertComment = (comment, article_id) => {
  return knex
    .insert(`${comment.username} as author`, comment.body, article_id)
    .into('comments')
    .returning('*');
};

exports.selectComments = article_id => {
  return knex('comments')
    .select('*')
    .where('article_id', article_id);
};
