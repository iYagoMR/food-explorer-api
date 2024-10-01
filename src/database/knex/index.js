const path = require('path');

const knex = require('knex')({
  client: 'pg',
  connection: {
    host: 'database-2.cluster-c9umcogwylxv.us-east-1.rds.amazonaws.com', // Replace with your RDS endpoint
    user: 'postgres', // RDS username
    password: 'romaozinho123', // RDS password
    database: 'postgres' // Name of your PostgreSQL database
  },
  migrations: {
    directory: path.resolve(__dirname, '..', 'knex', 'migrations')  // Adjust path to match your structure
  },
  seeds: {
    directory: path.resolve(__dirname, '..', 'seeds')
  },
  useNullAsDefault: true
});

module.exports = knex;
