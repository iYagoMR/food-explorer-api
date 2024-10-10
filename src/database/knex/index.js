const path = require('path');

require("dotenv/config");
console.log(process.env.RDS_HOST)

const knex = require('knex')({
  client: 'pg',
  connection: {
    host: process.env.RDS_HOST, // Replace with your RDS endpoint
    user: process.env.RDS_USER, // RDS username
    port: 5432,
    password: process.env.RDS_PASS, // RDS password
    database: process.env.RDS_DB, // Name of your PostgreSQL database
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
