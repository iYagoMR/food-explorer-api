const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class DishesController {
    async create(request, response, next) {
        try {
            const { name, price, description, category } = request.body;
            let { ingredients = [] } = request.body;
            const user_id = request.user.id;

            // Parse ingredients if provided as a JSON string
            if (typeof ingredients === 'string') {
                ingredients = JSON.parse(ingredients);
            }
            
            // Convert price to a number
            const numericPrice = parseFloat(price);
            if (isNaN(numericPrice)) {
                throw new AppError("Invalid price format", 400);
            }

            // Handle picture upload
            if (!request.file) {
                throw new AppError("Picture file is required", 400);
            }

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
            }).returning("id");

            // Insert the ingredients if provided
            if (ingredients.length > 0) {
                const ingredientsInsert = ingredients.map(ingredient => ({
                    dish_id,
                    name: ingredient,
                    user_id
                }));

                await knex("ingredients").insert(ingredientsInsert);
            }

            return response.status(201).json({ dish_id });
        } catch (error) {
            next(error);
        }
    }

    async update(request, response, next) {
        try {
            const { name, price, description, category, isFavorite } = request.body;
            let { ingredients = [] } = request.body;
            const { id } = request.params;

            if (typeof ingredients === 'string') {
                ingredients = JSON.parse(ingredients);
            }

            const dish = await knex("dishes").where({ id }).first();
            if (!dish) {
                throw new AppError("Dish not found", 404);
            }

            if (isFavorite !== undefined) {
                await knex("dishes")
                    .where({ id })
                    .update({
                        isFavorite,
                        updated_at: knex.fn.now()
                    });
                return response.json({ message: "Favorite status updated" });
            }

            const numericPrice = parseFloat(price);
            if (isNaN(numericPrice)) {
                throw new AppError("Invalid price format", 400);
            }

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
                    picture: fileName ? fileName : dish.picture,
                    updated_at: knex.fn.now()
                });

            if (ingredients.length > 0) {
                await knex("ingredients").where({ dish_id: dish.id }).delete();

                const ingredientsInsert = ingredients.map(ingredient => ({
                    dish_id: id,
                    name: ingredient,
                    user_id: request.user.id
                }));

                await knex("ingredients").insert(ingredientsInsert);
            }

            return response.json({ message: "Dish updated successfully" });
        } catch (error) {
            next(error);
        }
    }

    async show(request, response, next) {
        try {
            const { id } = request.params;

            const dish = await knex("dishes").where({ id }).first();
            if (!dish) {
                throw new AppError("Dish not found", 404);
            }

            const ingredients = await knex("ingredients").where({ dish_id: id }).orderBy("name");

            return response.json({
                ...dish,
                ingredients
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(request, response, next) {
        try {
            const { id } = request.params;

            const dish = await knex("dishes").where({ id }).first();
            if (!dish) {
                throw new AppError("Dish not found", 404);
            }

            await knex("dishes").where({ id }).delete();
            return response.json({ message: "Dish deleted successfully" });
        } catch (error) {
            next(error);
        }
    }

    async index(request, response, next) {
        try {
            const { name, ingredients, ingredient } = request.query;

            let dishes;

            if (ingredients) {
                const filterIngredients = ingredients.split(',').map(ingredient => ingredient.trim());

                dishes = await knex("ingredients")
                    .select([
                        "dishes.id",
                        "dishes.name",
                    ])
                    .whereILike("dishes.name", `%${name}%`) // PostgreSQL equivalent for whereLike()
                    .whereIn("ingredients.name", filterIngredients)
                    .innerJoin("dishes", "dishes.id", "ingredients.dish_id")
                    .groupBy("dishes.id")
                    .orderBy("dishes.name");
            } else {
                dishes = await knex("dishes")
                    .whereILike("name", `%${name}%`) // PostgreSQL equivalent for whereLike()
                    .orderBy("name");

                if (dishes.length < 1) {
                    dishes = await knex("ingredients")
                        .select([
                            "dishes.id",
                            "dishes.name",
                            "dishes.price",
                            "dishes.picture"
                        ])
                        .whereILike("ingredients.name", `%${ingredient}%`) // PostgreSQL equivalent for whereLike()
                        .innerJoin("dishes", "dishes.id", "ingredients.dish_id")
                        .groupBy("dishes.id")
                        .orderBy("dishes.name");
                }
            }

            const userIngredients = await knex("ingredients");

            const dishesWithIngredients = dishes.map(dish => {
                const dishIngredients = userIngredients.filter(ingredient => ingredient.dish_id === dish.id);
                return {
                    ...dish,
                    ingredients: dishIngredients
                };
            });

            return response.json(dishesWithIngredients);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = DishesController;
