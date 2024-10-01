exports.up = knex => knex.schema.createTable("order_items", table => {
    table.increments("id");
    table.text("name").notNullable();
    table.float("price").notNullable();
    table.integer("quantity").notNullable().defaultTo(1);
    
    table.integer("order_id")
         .references("id")
         .inTable("orders")
         .onDelete("CASCADE");  // Cascade delete when an order is deleted
    
    table.integer("dish_id")
         .references("id")
         .inTable("dishes")
         .onDelete("SET NULL");  // Optional: Set to NULL if the dish is deleted

    table.integer("user_id")
         .references("id")
         .inTable("users")
         .onDelete("SET NULL");  // Optional: Set to NULL if the user is deleted
    
    table.timestamp("created_at").defaultTo(knex.fn.now());  // Use defaultTo
    table.timestamp("updated_at").defaultTo(knex.fn.now());  // Use defaultTo
});

exports.down = knex => knex.schema.dropTable("order_items");
