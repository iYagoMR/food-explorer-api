const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class IngredientsController {
    async index(request, response, next) {
        try {
            const user_id = request.user.id;

            // Retrieve unique ingredients for the user, grouped by name
            const ingredients = await knex("ingredients")
                .select("name")
                .where({ user_id })
                .groupBy("name");

            if (!ingredients.length) {
                throw new AppError("No ingredients found", 404);
            }

            return response.json(ingredients);
        } catch (error) {
            // Handle any potential errors
            next(error);
        }
    }
}

module.exports = IngredientsController;
