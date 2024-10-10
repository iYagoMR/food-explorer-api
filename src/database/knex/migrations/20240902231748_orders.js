exports.up = knex => knex.schema.createTable("orders", table => {
     table.increments("id").primary();  // Explicitly define primary key
     table.float("total_price").notNullable();
     table.text("payment_method").notNullable();
     table.text("status").notNullable();
 
     table.integer("address_id")
          .references("id")
          .inTable("addresses")
          .onDelete("SET NULL")
          .index();  // Index on address_id
     
     table.integer("user_id")
          .references("id")
          .inTable("users")
          .onDelete("CASCADE")
          .index();  // Index on user_id
 
     table.timestamp("created_at").defaultTo(knex.fn.now());  // Use defaultTo
     table.timestamp("updated_at").defaultTo(knex.fn.now());  // Use defaultTo
 });
 
 exports.down = knex => knex.schema.dropTable("orders");
 