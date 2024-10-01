const knex = require('./src/database/knex'); // Adjust the path to your knex instance

async function testConnection() {
  try {
    // Query the "dishes" table
    const dishes = await knex("dishes");

    // If there are results, it will be an array
    if (dishes.length > 0) {
      console.log('Database connection is working:', dishes);
    } else {
      console.log('No dishes found with ID 1.');
    }
  } catch (error) {
    console.error('Failed to connect to the database:', error);
  } finally {
    knex.destroy(); // Close the connection pool
  }
}

testConnection();