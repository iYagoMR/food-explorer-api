const { hash } = require("bcryptjs");

exports.seed = async function(knex) {

    // Hash the passwords before inserting
    const adminPassword = await hash('123', 8);
    const customerPassword = await hash('123', 8);

    await knex('users').del();
    // Create users
    await knex('users').insert([
        {
          id: 1,
          name: 'admin',
          email: 'admin@email.com',
          password: adminPassword, // Use hashed password
          role: 'admin',
          created_at: knex.fn.now(),
          updated_at: knex.fn.now()
        },
        {
          id: 2,
          name: 'customer',
          email: 'customer@email.com',
          password: customerPassword, // Use hashed password
          role: 'customer',
          created_at: knex.fn.now(),
          updated_at: knex.fn.now()
        }
    ]);

    await knex('dishes').del();
    //Create dishes
    await knex("dishes").insert([
        {
            picture: 'src/assets/plates/Mask group-3.png',
            name: "Greek salad",
            price: 12,
            category: "salad",
            description: "A refreshing mix of cucumbers, tomatoes, olives, and feta cheese.",
            created_at: knex.fn.now(),
            updated_at: knex.fn.now()
        },
        {
            picture: 'src/assets/plates/Mask group.png',
            name: "Kale & chicken salad",
            price: 12,
            category: "salad",
            description: "A hearty salad with grilled chicken, kale, and a light vinaigrette.",
            created_at: knex.fn.now(),
            updated_at: knex.fn.now()
        },
        {
            picture: 'src/assets/plates/Mask group.png',
            name: "House salad",
            price: 12,
            category: "salad",
            description: "Mixed greens, tomatoes, and cucumbers topped with house-made dressing.",
            created_at: knex.fn.now(),
            updated_at: knex.fn.now()
        },
        {
            picture: 'src/assets/plates/Mask group-8.png', // New picture for the added dish
            name: "Caesar salad",
            price: 14,
            category: "salad",
            description: "Crisp romaine lettuce, croutons, and Parmesan cheese with Caesar dressing.",
            created_at: knex.fn.now(),
            updated_at: knex.fn.now()
        },
        {
            picture: 'src/assets/plates/Mask group-2.png',
            name: "Shrimp",
            price: 22,
            category: "meal",
            description: "Grilled shrimp served with garlic butter and seasonal vegetables.",
            created_at: knex.fn.now(),
            updated_at: knex.fn.now()
        },
        {
            picture: 'src/assets/plates/Mask group-1.png',
            name: "Bread & ham",
            price: 12,
            category: "meal",
            description: "Rustic bread served with thinly sliced ham and a side of mustard.",
            created_at: knex.fn.now(),
            updated_at: knex.fn.now()
        },
        {
            picture: 'src/assets/plates/Mask group-5.png',
            name: "Puff pastry",
            price: 10,
            category: "meal",
            description: "Light and flaky puff pastry filled with savory ingredients.",
            created_at: knex.fn.now(),
            updated_at: knex.fn.now()
        },
        {
            picture: 'src/assets/plates/Mask group-9.png', // New picture for the added dish
            name: "Grilled steak",
            price: 28,
            category: "meal",
            description: "Juicy grilled steak served with mashed potatoes and green beans.",
            created_at: knex.fn.now(),
            updated_at: knex.fn.now()
        },
        {
            picture: 'src/assets/plates/Mask group-4.png',
            name: "Plum galette",
            price: 16,
            category: "dessert",
            description: "A rustic tart filled with fresh plums and served with whipped cream.",
            created_at: knex.fn.now(),
            updated_at: knex.fn.now()
        },
        {
            picture: 'src/assets/plates/Mask group-6.png',
            name: "Macaron",
            price: 4,
            category: "dessert",
            description: "Delicate French macarons in assorted flavors.",
            created_at: knex.fn.now(),
            updated_at: knex.fn.now()
        },
        {
            picture: 'src/assets/plates/Mask group-7.png',
            name: "Plum cake",
            price: 4,
            category: "dessert",
            description: "Moist plum cake with a hint of cinnamon and nutmeg.",
            created_at: knex.fn.now(),
            updated_at: knex.fn.now()
        },
        {
            picture: 'src/assets/plates/Mask group-10.png', // New picture for the added dish
            name: "Chocolate mousse",
            price: 6,
            category: "dessert",
            description: "Rich and creamy chocolate mousse topped with whipped cream.",
            created_at: knex.fn.now(),
            updated_at: knex.fn.now()
        }
    ]);

    await knex('ingredients').del();
    //Seed ingredients
    await knex('ingredients').insert([
        { name: 'Feta Cheese', dish_id: 1, user_id: 1 },
        { name: 'Olives', dish_id: 1, user_id: 1 },
        { name: 'Tomatoes', dish_id: 1, user_id: 1 },
        { name: 'Kale', dish_id: 2, user_id: 1 },
        { name: 'Grilled Chicken', dish_id: 2, user_id: 1 },
        { name: 'Lettuce', dish_id: 3, user_id: 1 },
        { name: 'Shrimp', dish_id: 4, user_id: 1 },
        { name: 'Garlic Butter', dish_id: 4, user_id: 1 },
        { name: 'Rustic Bread', dish_id: 5, user_id: 1 },
        { name: 'Ham', dish_id: 5, user_id: 1 },
        { name: 'Puff Pastry', dish_id: 6, user_id: 1 },
        { name: 'Plums', dish_id: 7, user_id: 1 },
        { name: 'Almond Flour', dish_id: 8, user_id: 1 },
        { name: 'Sugar', dish_id: 8, user_id: 1 },
        { name: 'Plum Puree', dish_id: 9, user_id: 1 }
    ]);
};
