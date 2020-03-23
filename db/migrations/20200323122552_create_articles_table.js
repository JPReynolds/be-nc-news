exports.up = function(knex) {
  console.log('creating articles table');
  return knex.schema.createTable('articles', articlesTable => {
    articlesTable.increments('article_id');
    articlesTable.string('title');
    articlesTable.string('body');
    articlesTable.bigInteger('votes').defaultTo(0);
    articlesTable.string('topic').references('topics.slug');
    articlesTable.string('author').references('users.username');
    articlesTable.timestamp('created_at');
  });
};

exports.down = function(knex) {
  console.log('dropping articles table');
  return knex.schema.dropTable('articles');
};
