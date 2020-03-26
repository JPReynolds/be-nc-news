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
  // .then(comments => {
  //   if (comments.length === 0) {
  //     return Promise.reject({ status: 404, msg: 'article does not exist' });
  //   } else {
  //     return comments;
  //   }
  // });
};
