const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class DishesController {
    async create(request, response) {
        const { name, price, description, category } = request.body;
        let { ingredients = [] } = request.body;
        const user_id = request.user.id;

        // Parse ingredients if provided as a JSON string
        if (typeof ingredients === 'string') {
            ingredients = JSON.parse(ingredients);
        }
        
        // Convert price to a number
        const numericPrice = parseFloat(price);

        // Handle picture upload
        const pictureFilename = request.file.filename;
        const diskStorage = new DiskStorage();
        const fileName = await diskStorage.saveFile(pictureFilename);

        // Insert the new dish into the 'dishes' table
        const [dish_id] = await knex("dishes").insert({
            name,
            picture: fileName,
            price: numericPrice,
            category,
            description,
            user_id
        }).returning("id"); // PostgreSQL requires returning() to get the inserted ID
        
        // Insert the ingredients if provided
        if (ingredients.length > 0) {
            const ingredientsInsert = ingredients.map(name => ({
                dish_id,
                name,
                user_id
            }));

            await knex("ingredients").insert(ingredientsInsert);
        }

        return response.json();
    }

    async update(request, response) {
        const { name, price, description, category, isFavorite } = request.body;
        let { ingredients = [] } = request.body;
        const { id } = request.params;

        if (typeof ingredients === 'string') {
            ingredients = JSON.parse(ingredients);
        }

        const dish = await knex("dishes").where({ id }).first();
        if (!dish) {
            throw new AppError("Dish not found");
        }

        if (isFavorite) {
            await knex("dishes")
                .where({ id })
                .update({
                    isFavorite,
                    updated_at: knex.fn.now()
                });
            return response.json();
        }

        const numericPrice = parseFloat(price);

        // Update picture if provided
        let fileName;
        if (request.file) {
            const diskStorage = new DiskStorage();
            if (dish.picture) {
                await diskStorage.deleteFile(dish.picture);
            }
            const pictureFilename = request.file.filename;
            fileName = await diskStorage.saveFile(pictureFilename);
        }

        await knex("dishes")
            .where({ id })
            .update({
                name,
                price: numericPrice,
                description,
                category,
                picture: fileName ? fileName : undefined,
                updated_at: knex.fn.now()
            });

        if (ingredients.length > 0) {
            await knex("ingredients").where({ dish_id: dish.id }).delete();

            const ingredientsInsert = ingredients.map(name => ({
                dish_id: id,
                name,
                user_id: request.user.id
            }));

            await knex("ingredients").insert(ingredientsInsert);
        }

        return response.json();
    }

    async show(request, response) {
        const { id } = request.params;

        const dish = await knex("dishes").where({ id }).first();
        const ingredients = await knex("ingredients").where({ dish_id: id }).orderBy("name");

        return response.json({
            ...dish,
            ingredients
        });
    }

    async delete(request, response) {
        const { id } = request.params;
        await knex("dishes").where({ id }).delete();
        return response.json();
    }

    async index(request, response) {
        //const { name, ingredients, ingredient } = request.query;

        //let dishes;

        // if (ingredients) {
        //     const filterIngredients = ingredients.split(',').map(ingredient => ingredient);

        //     dishes = await knex("ingredients")
        //         .select([
        //             "dishes.id",
        //             "dishes.name",
        //         ])
        //         .whereILike("dishes.name", `%${name}%`) // PostgreSQL equivalent for whereLike()
        //         .whereIn("ingredients.name", filterIngredients)
        //         .innerJoin("dishes", "dishes.id", "ingredients.dish_id")
        //         .groupBy("dishes.id")
        //         .orderBy("dishes.name");
        // } else {
        //     dishes = await knex("dishes")
        //         .whereILike("name", `%${name}%`) // PostgreSQL equivalent for whereLike()
        //         .orderBy("name");

        //     if (dishes.length < 1) {
        //         dishes = await knex("ingredients")
        //             .select([
        //                 "dishes.id",
        //                 "dishes.name",
        //                 "dishes.price",
        //                 "dishes.picture"
        //             ])
        //             .whereILike("ingredients.name", `%${ingredient}%`) // PostgreSQL equivalent for whereLike()
        //             .innerJoin("dishes", "dishes.id", "ingredients.dish_id")
        //             .groupBy("dishes.id")
        //             .orderBy("dishes.name");
        //     }
        // }

        // const userIngredients = await knex("ingredients");

        // const dishesWithIngredients = dishes.map(dish => {
        //     const dishIngredients = userIngredients.filter(ingredient => ingredient.dish_id === dish.id);
        //     return {
        //         ...dish,
        //         dishes: dishIngredients
        //     };
        // });

        //return response.json(dishesWithIngredients);

        const dishes = await knex("dishes");
        
        return response.json(dishes);   
    }
}

module.exports = DishesController;
