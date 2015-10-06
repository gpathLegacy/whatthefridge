
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
