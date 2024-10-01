const knex = require('knex');

const db = require('./src/database/knex');

async function migrateAndSeed() {
  try {
    // Fetch all tables (PostgreSQL version)
    const tables = await db.raw("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");

    // Drop all tables
    for (const table of tables.rows) {  // Access the table names through rows
      if (table.table_name !== 'knex_migrations' && table.table_name !== 'knex_migrations_lock') { // Don't delete migration tables
        await db.schema.dropTableIfExists(table.table_name);
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
  } finally {
    // Close the database connection
    await db.destroy();
  }
}

// Export the function so it can be called in server.js
module.exports = migrateAndSeed;
