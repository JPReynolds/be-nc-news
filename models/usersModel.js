const knex = require('../db/connection');

exports.selectUser = username => {
  return knex('users')
    .select('*')
    .where('username', username)
    .then(result => {
      if (result.length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'user does not exist'
        });
      }
    });
};
