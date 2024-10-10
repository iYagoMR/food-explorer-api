exports.up = knex => knex.schema.createTable("order_items", table => {
     table.increments("id").primary();  // Explicitly define primary key
     table.text("name").notNullable();
     table.float("price").notNullable();
     table.integer("quantity").notNullable().defaultTo(1);
     
     table.integer("order_id")
          .references("id")
          .inTable("orders")
          .onDelete("CASCADE")
          .index();  // Index on order_id
     
     table.integer("dish_id")
          .references("id")
          .inTable("dishes")
          .onDelete("SET NULL")
          .index();  // Index on dish_id
 
     table.integer("user_id")
          .references("id")
          .inTable("users")
          .onDelete("SET NULL")
          .index();  // Index on user_id
 
     table.timestamp("created_at").defaultTo(knex.fn.now());  // Use defaultTo
     table.timestamp("updated_at").defaultTo(knex.fn.now());  // Use defaultTo
 });
 
 exports.down = knex => knex.schema.dropTable("order_items");
 