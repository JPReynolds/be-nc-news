exports.up = function(knex) {
  console.log('creating comments table');
  return knex.schema.createTable('comments', commentsTable => {
    commentsTable.increments('comment_id');
    commentsTable
      .string('author')
      .references('users.username')
      .notNullable();
    commentsTable
      .integer('article_id')
      .references('articles.article_id')
      .notNullable();
    commentsTable.bigInteger('votes').defaultTo(0);
    commentsTable.timestamp('created_at');
    commentsTable.string('body', 4000);
  });
};

exports.down = function(knex) {
  console.log('dropping comments table');
  return knex.schema.dropTable('comments');
};
