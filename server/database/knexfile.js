// this connection will be exported to the server.
// save this file in server or one level deep in database?
// REFACTOR to have two configurations, for dev and production environments.

var databasehost = process.env.DATABASE_URL || 'localhost';
var knex = require('knex')({
 client: 'pg',
 connection: {
   host: databasehost,
   user: 'root',
   password: '',
   database: 'wtfridge',
   charset: 'utf8'
 }
});

module.exports.knex = knex;
