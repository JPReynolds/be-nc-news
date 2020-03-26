const knex = require('../db/connection');

exports.insertComment = comment => {
  return knex
    .insert(comment)
    .into('comments')
    .returning('*');
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

exports.updateComment = (comment_id, votes = 0) => {
  return knex('comments')
    .first('*')
    .where({ comment_id })
    .increment({ votes })
    .returning('*')
    .then(([comment]) => {
      if (!comment) {
        return Promise.reject({ status: 404, msg: 'comment does not exist' });
      } else {
        return comment;
      }
    });
};
