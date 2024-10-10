exports.up = knex => knex.schema.createTable("ingredients", table => {
     table.increments("id").primary();  // Explicitly define primary key
     table.text("name").notNullable().unique();  // Ensure ingredient names are unique
     
     table.integer("dish_id")
          .references("id")
          .inTable("dishes")
          .onDelete("CASCADE")
          .index();  // Index on dish_id
     
     table.integer("user_id")
          .references("id")
          .inTable("users")
          .onDelete("SET NULL")
          .index();  // Index on user_id
   
     // Optionally add timestamps
     table.timestamp("created_at").defaultTo(knex.fn.now());
     table.timestamp("updated_at").defaultTo(knex.fn.now());
   });
   
   exports.down = knex => knex.schema.dropTable("ingredients");
   