exports.up = knex => knex.schema.createTable("orders", table => {
    table.increments("id");
    table.float("total_price").notNullable();
    table.text("payment_method").notNullable();
    table.text("status").notNullable();

    table.integer("address_id")
         .references("id")
         .inTable("addresses")
         .onDelete("SET NULL");  // Optional: Set to NULL if the address is deleted
    
    table.integer("user_id")
         .references("id")
         .inTable("users")
         .onDelete("CASCADE");  // Optional: Cascade delete if the user is deleted

    table.timestamp("created_at").defaultTo(knex.fn.now());  // Use defaultTo
    table.timestamp("updated_at").defaultTo(knex.fn.now());  // Use defaultTo
});

exports.down = knex => knex.schema.dropTable("orders");
