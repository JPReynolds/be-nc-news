exports.up = function(knex) {
  return knex.schema.createTable('comments', commentsTable => {
    commentsTable.increments('comment_id');
    commentsTable
      .string('author')
      .references('users.username')
      .notNullable();
    commentsTable.integer('article_id').references('articles.article_id');
    commentsTable.bigInteger('votes').defaultTo(0);
    commentsTable.timestamp('created_at');
    commentsTable.string('body', 4000).notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('comments');
};
