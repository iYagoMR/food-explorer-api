const knex = require('knex')({
    client: 'pg',
    connection: {
      host: 'database-2.cluster-c9umcogwylxv.us-east-1.rds.amazonaws.com', // Replace with your RDS endpoint
      user: 'postgres', // RDS username
      password: 'romaozinho123', // RDS password
      database: 'postgres' // Name of your PostgreSQL database
    }
  });

//const connection = knex(config.development);

module.exports = knex;