const knexMaker = require('knex');
const customConfig = require('../knexfile');

const knex = knexMaker(customConfig);

module.exports = knex;
