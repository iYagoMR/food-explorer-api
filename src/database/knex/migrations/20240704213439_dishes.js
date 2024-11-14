exports.up = knex => knex.schema.createTable("dishes", table => {
    table.increments("id");
    table.varchar("picture").notNullable();
    table.text("name").notNullable();
    table.float("price").notNullable();
    table.text("category").notNullable();
    table.text("description").notNullable();
    
    table.integer("user_id")
        .references("id")
        .inTable("users")
        .onDelete("SET NULL");  // This will set the user_id to NULL if the user is deleted
    
    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("dishes");