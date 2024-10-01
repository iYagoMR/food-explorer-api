exports.up = knex => knex.schema.createTable("users", table => {
  table.increments("id");
  table.text("name").notNullable();
  table.text("email").notNullable();
  table.text("password").notNullable();
  
  table
    .enum("role", ["admin", "customer", "sale"], { useNative: true, enumName: "roles" })
    .notNullable()
    .defaultTo("customer");  // Use defaultTo instead of default

  table.timestamp("created_at").defaultTo(knex.fn.now());
  table.timestamp("updated_at").defaultTo(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("users");
