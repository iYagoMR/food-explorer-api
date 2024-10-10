exports.up = knex => knex.schema.createTable("addresses", table => {
    table.increments("id").primary();  // Explicitly define primary key
    table.text("address").notNullable();
    table.text("city").notNullable();
    table.text("state").notNullable();

    table.integer("user_id")
         .references("id")
         .inTable("users")
         .onDelete("CASCADE")
         .index();  // Index on user_id

    // Optionally add a ZIP code field
    // table.text("zip_code").notNullable();

    table.timestamp("created_at").defaultTo(knex.fn.now());  // Use defaultTo
});
  
exports.down = knex => knex.schema.dropTable("addresses");