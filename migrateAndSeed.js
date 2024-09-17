const knex = require('knex');
const knexfile = require('./knexfile'); // Adjust the path as needed

const db = knex(knexfile.development);

async function migrateAndSeed() {
  try {
    // Disable foreign key constraints
    await db.raw('PRAGMA foreign_keys = OFF');

    // Fetch all tables
    const tables = await db.raw("SELECT name FROM sqlite_master WHERE type='table'");

    // Drop all tables
    for (const table of tables) {
      if (table.name !== 'sqlite_sequence') { // Don't delete sqlite_sequence
        await db.schema.dropTableIfExists(table.name);
      }
    }

    // Run migrations
    console.log('Running migrations...');
    await db.migrate.latest();
    console.log('Migrations completed.');

    // Seed data
    console.log('Seeding data...');
    await db.seed.run();
    console.log('Data seeding completed.');
  } catch (error) {
    console.error('Error during migration and seeding:', error);
    throw error; // Re-throw the error to handle it in the server.js
  }
}

// Export the function so it can be called in server.js
module.exports = migrateAndSeed;
