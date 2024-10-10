exports.up = knex => knex.schema.createTable("dishes", table => {
    table.increments("id").primary();  // Explicitly set primary key
    table.string("picture", 255).notNullable();  // Use string with max length
    table.text("name").notNullable();
    table.float("price").notNullable();
    table.text("category").notNullable();
    table.text("description").notNullable();
    
    table.integer("user_id")
         .references("id")
         .inTable("users")
         .onDelete("CASCADE")
         .index();  // Index on user_id
    
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("dishes");