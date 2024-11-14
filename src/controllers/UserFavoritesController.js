const knex = require("../database/knex");

class DishesController {

    async create(request, response){
        const dish_id = request.params;
        const user_id = request.user.id;

        await knex("userFavorites").insert({
            dish_id: dish_id.id,
            user_id
        });

        return response.json();
    }
    
    async delete(request, response){
        const user_id = request.user.id;
        const { dish_id } = request.params;

        await knex("userFavorites").where({ dish_id, user_id}).delete();
        
        return response.json();
    }

    async index(request, response){
        const user_id = request.user.id;

        const dishes = await knex("userFavorites")
            .select([
                "dishes.id",
                "dishes.name",
                "dishes.picture",
                "dishes.user_id"
            ])
            .where("userFavorites.user_id", user_id)
            .innerJoin("dishes", "dishes.id", "userFavorites.dish_id")
            .groupBy("dishes.id")
            .orderBy("dishes.id");
        
        return response.json(dishes);
    }

    async show(request, response){
        const dish_id = request.params;
        
        const dish = await knex("userFavorites")
            .select([
                "userFavorites.id",
                "dishes.id",
                "dishes.name",
                "dishes.picture"
            ])
            .where("userFavorites.dish_id", dish_id.id)
            .innerJoin("dishes", "dishes.id", "userFavorites.dish_id")
            .first();

        if(dish){
            return response.json(dish);
        }
        else{
            return response.status(404).json();
        }
    }
}

module.exports = DishesController;