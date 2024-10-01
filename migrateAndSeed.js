const knex = require('./src/database/knex');

async function migrateAndSeed() {
  try {

    //Run migrations
    console.log('Running migrations...');
    await knex.migrate.latest();
    console.log('Migrations completed.');

    // Seed data
    console.log('Seeding data...');
    await knex.seed.run();
    console.log('Data seeding completed.');
  } catch (error) {
    console.error('Error during migration and seeding:', error);
    throw error;
  } finally {
    // Close the database connection to avoid Lambda timeout
    console.log('Destroying Knex connection...');
    await knex.destroy();
  }
}

module.exports = migrateAndSeed;
