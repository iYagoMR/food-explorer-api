exports.up = knex => knex.schema.createTable("userFavorites", table => {
    table.increments("id");

    table.integer("dish_id").references("id").inTable("dishes");
    table.integer("user_id").references("id").inTable("users");

    table.primary(["user_id", "dish_id"]);
    
    table.timestamp("created_at").default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("userFavorites");