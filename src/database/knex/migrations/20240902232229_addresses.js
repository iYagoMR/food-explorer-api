exports.up = knex => knex.schema.createTable("addresses", table => {
    table.increments("id");
    table.text("address").notNullable();
    table.text("city").notNullable();
    table.text("state").notNullable();

    table.integer("user_id")
         .references("id")
         .inTable("users")
         .onDelete("CASCADE");  // Cascade delete when user is deleted

    table.timestamp("created_at").defaultTo(knex.fn.now());  // Use defaultTo
});
  
exports.down = knex => knex.schema.dropTable("addresses");
