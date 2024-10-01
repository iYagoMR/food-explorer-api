exports.up = knex => knex.schema.createTable("userFavorites", table => {
    table.increments("id");

    table.integer("dish_id")
         .references("id")
         .inTable("dishes")
         .onDelete("CASCADE");  // Optional: Cascade delete if a dish is deleted

    table.integer("user_id")
         .references("id")
         .inTable("users")
         .onDelete("CASCADE");  // Optional: Cascade delete if a user is deleted

    table.primary(["user_id", "dish_id"]);
    
    table.timestamp("created_at").defaultTo(knex.fn.now());  // Use defaultTo
});

exports.down = knex => knex.schema.dropTable("userFavorites");
