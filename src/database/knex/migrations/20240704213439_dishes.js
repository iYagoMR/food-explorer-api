exports.up = knex => knex.schema.createTable("dishes", table => {
    table.increments("id");
    table.string("picture").notNullable();  // Use string instead of varchar
    table.text("name").notNullable();
    table.float("price").notNullable();
    table.text("category").notNullable();
    table.text("description").notNullable();
    
    table.integer("user_id")
         .references("id")
         .inTable("users")
         .onDelete("CASCADE");  // Optional: Add cascade delete if desired
    
    table.timestamp("created_at").defaultTo(knex.fn.now());  // Use defaultTo
    table.timestamp("updated_at").defaultTo(knex.fn.now());  // Use defaultTo
});

exports.down = knex => knex.schema.dropTable("dishes");
