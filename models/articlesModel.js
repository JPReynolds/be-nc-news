const knex = require('../db/connection');

exports.selectArticles = (sort_by, order, author, topic) => {
  return knex
    .select('articles.*')
    .count('comment_id as comment_count')
    .from('articles')
    .modify((query) => {
      if (topic) query.where({ topic });
      if (author) query.where({ 'articles.author': author });
    })
    .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .groupBy('articles.article_id')
    .orderBy(sort_by || 'created_at', order || 'desc');
};

exports.selectArticleByID = (article_id) => {
  return knex
    .select('articles.*')
    .count('comment_id as comment_count')
    .from('articles')
    .where('articles.article_id', article_id)
    .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .groupBy('articles.article_id')
    .then(([article]) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: 'article does not exist' });
      } else {
        return article;
      }
    });
};

exports.updateArticle = (article_id, votes = 0) => {
  return knex('articles')
    .first()
    .where('article_id', article_id)
    .increment({ votes })
    .returning('*')
    .then(([article]) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: 'article does not exist' });
      } else {
        return article;
      }
    });
};

exports.checkArticleExists = (article_id) => {
  return knex('articles')
    .first()
    .where({ article_id })
    .then((article) => {
      return article
        ? article
        : Promise.reject({ status: 404, msg: 'article does not exist' });
    });
};
