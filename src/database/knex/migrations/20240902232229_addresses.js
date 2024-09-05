exports.up = knex => knex.schema.createTable("addresses", table => {
    table.increments("id");
    table.text("address").notNullable();

    table.integer("order_id").references("id").inTable("orders").onDelete("CASCADE");
    table.integer("user_id").references("id").inTable("users").onDelete("CASCADE");

    table.timestamp("created_at").default(knex.fn.now());
});
  
exports.down = knex => knex.schema.dropTable("addresses");