exports.up = knex => knex.schema.createTable("ingredients", table => {
  table.increments("id");
  table.text("name").notNullable();
  
  table.integer("dish_id")
       .references("id")
       .inTable("dishes")
       .onDelete("CASCADE");  // Cascade delete when a dish is deleted
  
  table.integer("user_id")
       .references("id")
       .inTable("users")
       .onDelete("SET NULL");  // Optional: set to null if user is deleted

  // Optionally add timestamps
  table.timestamp("created_at").defaultTo(knex.fn.now());
  table.timestamp("updated_at").defaultTo(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("ingredients");
