const knex = require('../db/connection');

exports.insertComment = comment => {
  if ('author' || 'body' === undefined || Object.keys(comment).length > 2) {
    return Promise.reject({ status: 400, msg: 'bad request' });
  } else {
    return knex
      .insert(comment)
      .into('comments')
      .returning('*');
  }
};

exports.selectComments = (
  article_id,
  sort_by = 'created_at',
  order = 'desc'
) => {
  return knex('comments')
    .select('*')
    .where('article_id', article_id)
    .orderBy(sort_by, order);
};

exports.updateComment = (comment_id, votes) => {
  return knex('comments')
    .first('*')
    .where({ comment_id })
    .increment({ votes })
    .returning('*');
};
