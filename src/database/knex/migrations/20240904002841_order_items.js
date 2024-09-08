exports.up = knex => knex.schema.createTable("order_items", table => {
    table.increments("id");
    table.text("name").notNullable();
    table.float("price").notNullable();
    table.integer("quantity").notNullable().defaultTo(1);
    
    table.integer("order_id").references("id").inTable("orders").onDelete("CASCADE");
    table.integer("dish_id").references("id").inTable("dishes");
    table.integer("user_id").references("id").inTable("users");
    
    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("order_items");
