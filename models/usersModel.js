const knex = require('../db/connection');

exports.selectUser = username => {
  return knex('users')
    .first('*')
    .where({ username })
    .then(user => {
      if (!user) {
        return Promise.reject({
          status: 404,
          msg: 'user does not exist'
        });
      }
      return user;
    });
};
