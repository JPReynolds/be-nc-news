const knexMaker = require('knex');
const dbConfig = require('../knexfile');

const knex = knexMaker(dbConfig);

module.exports = knex;
