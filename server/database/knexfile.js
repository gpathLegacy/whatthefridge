//this file is used by the server for creating a connection to the postgres server
module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      database: 'gigapath',
      user:     '',
      password: ''
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     '',
      password: ''
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
  //this is the production environment used by heroku
  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
