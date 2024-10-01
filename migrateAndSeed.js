const knex = require('./src/database/knex');

async function migrateAndSeed() {
  try {
    // Fetch all tables (PostgreSQL version)
    // const tables = await knex.raw("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");

    // // Drop all tables except migration-related ones
    // for (const table of tables.rows) {
    //   if (table.table_name !== 'knex_migrations' && table.table_name !== 'knex_migrations_lock') {
    //     await knex.schema.dropTableIfExists(table.table_name);
    //   }
    // }

    // Run migrations
    // console.log('Running migrations...');
    // await knex.migrate.latest();
    // console.log('Migrations completed.');

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
