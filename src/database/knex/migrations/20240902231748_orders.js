exports.up = knex => knex.schema.createTable("orders", table => {
    table.increments("id");
    table.float("total_price").notNullable();
    table.text("payment_method").notNullable();
    table.text("status").notNullable();

    table.integer("address_id").references("id").inTable("addresses");
    table.integer("user_id").references("id").inTable("users");

    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("orders");