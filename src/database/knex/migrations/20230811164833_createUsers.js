exports.up = async (knex) => {
  // Drop the enum type if it exists
  await knex.raw('DROP TYPE IF EXISTS roles');

  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();  // Explicitly define primary key
    table.text("name").notNullable();
    table.text("email").notNullable().unique();  // Ensure email uniqueness
    table.text("password").notNullable();

    // Define role enum with a default value
    table
      .enum("role", ["admin", "customer", "sale"], { useNative: true, enumName: "roles" })
      .notNullable()
      .defaultTo("customer");

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = async (knex) => {
  return knex.schema.dropTable("users");  // Ensure this is also an async function
};
