exports.up = async (knex) => {
  await knex.raw('DROP TYPE IF EXISTS roles');

  return knex.schema.createTable("users", (table) => {
    table.increments("id");
    table.text("name").notNullable();
    table.text("email").notNullable();
    table.text("password").notNullable();

    table
      .enum("role", ["admin", "customer", "sale"], { useNative: true, enumName: "roles" })
      .notNullable()
      .defaultTo("customer");

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = knex => knex.schema.dropTable("users");
