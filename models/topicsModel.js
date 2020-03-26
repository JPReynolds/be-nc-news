const knex = require('../db/connection');

exports.selectTopics = () => {
  return knex('topics').select('*');
};

exports.checkTopicExists = slug => {
  if (slug) {
    return knex('topics')
      .first()
      .where({ slug })
      .then(topic => {
        return topic
          ? topic
          : Promise.reject({ status: 404, msg: 'topic does not exist' });
      });
  }
};
