exports.up = function(knex) {
  return knex.schema.createTable('users', usersTable => {
    usersTable
      .string('username')
      .primary()
      .unique()
      .notNullable();
    usersTable.string('avatar_url').notNullable();
    usersTable.string('name');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
