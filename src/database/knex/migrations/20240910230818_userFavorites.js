exports.up = knex => knex.schema.createTable("userFavorites", table => {
     table.increments("id").primary();  // Explicitly define primary key
 
     table.integer("dish_id")
          .references("id")
          .inTable("dishes")
          .onDelete("CASCADE")
          .index();  // Index on dish_id
 
     table.integer("user_id")
          .references("id")
          .inTable("users")
          .onDelete("CASCADE")
          .index();  // Index on user_id
 
     table.primary(["user_id", "dish_id"]);  // Composite primary key
     
     table.timestamp("created_at").defaultTo(knex.fn.now());  // Use defaultTo
     table.timestamp("updated_at").defaultTo(knex.fn.now());  // Optional: Track updates
 });
 
 exports.down = knex => knex.schema.dropTable("userFavorites");
 