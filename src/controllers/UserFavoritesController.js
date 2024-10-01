const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class UserFavoritesController {
    async create(request, response, next) {
        const { id: dish_id } = request.params; // Destructure dish_id from params
        const user_id = request.user.id;

        try {
            // Check if the favorite already exists
            const existingFavorite = await knex("userFavorites")
                .where({ dish_id, user_id })
                .first();

            if (existingFavorite) {
                throw new AppError("Dish already in favorites.", 400); // Return 400 for bad request
            }

            await knex("userFavorites").insert({
                dish_id,
                user_id,
            });

            return response.status(201).json({ message: "Dish added to favorites." });
        } catch (error) {
            next(error); // Pass the error to the global error handler
        }
    }

    async delete(request, response, next) {
        const user_id = request.user.id;
        const { id: dish_id } = request.params; // Destructure dish_id from params

        try {
            const deletedCount = await knex("userFavorites")
                .where({ dish_id, user_id })
                .delete();

            if (deletedCount === 0) {
                throw new AppError("Favorite not found.", 404); // Return 404 if not found
            }

            return response.status(200).json({ message: "Dish removed from favorites." });
        } catch (error) {
            next(error); // Pass the error to the global error handler
        }
    }

    async index(request, response, next) {
        const user_id = request.user.id;

        try {
            const dishes = await knex("userFavorites")
                .select([
                    "dishes.id",
                    "dishes.name",
                    "dishes.picture",
                ])
                .where("userFavorites.user_id", user_id)
                .innerJoin("dishes", "dishes.id", "userFavorites.dish_id")
                .groupBy("dishes.id")
                .orderBy("dishes.id");

            return response.json(dishes);
        } catch (error) {
            next(error); // Pass the error to the global error handler
        }
    }

    async show(request, response, next) {
        const { id: dish_id } = request.params; // Destructure dish_id from params

        try {
            const dish = await knex("userFavorites")
                .select([
                    "userFavorites.id",
                    "dishes.id",
                    "dishes.name",
                    "dishes.picture",
                ])
                .where("userFavorites.dish_id", dish_id)
                .innerJoin("dishes", "dishes.id", "userFavorites.dish_id")
                .first();

            if (!dish) {
                throw new AppError("Favorite not found.", 404); // Return 404 if not found
            }

            return response.json(dish);
        } catch (error) {
            next(error); // Pass the error to the global error handler
        }
    }
}

module.exports = UserFavoritesController;
