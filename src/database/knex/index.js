const path = require('path');

const knex = require('knex')({
  client: 'pg',
  connection: {
    host: 'food-explorer.c9umcogwylxv.us-east-1.rds.amazonaws.com', // Replace with your RDS endpoint
    user: 'foodexp', // RDS username
    port: 5432,
    password: "romaozinho...123", // RDS password
    database: 'foodexp', // Name of your PostgreSQL database
    ssl: {
      require: true,
      rejectUnauthorized: false // Set to true for production environments with certificates
    }
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
