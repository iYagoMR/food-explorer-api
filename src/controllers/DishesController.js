const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class DishesController {
  async create(request, response) {
    const { picture, name, price, description, category, ingredients = [] } = request.body;
    const user_id = request.user.id;

    //Handle picture upload
    const pictureFilename = request.file.filename;
    const diskStorage = new DiskStorage();
    
    const fileName = await diskStorage.saveFile(pictureFilename);

    const [dish_id] = await knex("dishes").insert({
        name,
        picture: fileName,
        price,
        category,
        description,
        user_id,
    });
    
    if(ingredients.length > 0){
        const ingredientsInsert = ingredients.map(name => {
            return {
                dish_id,
                name,
                user_id
            }
        });

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
    const { name, ingredients } = request.query;

    const user_id = request.user.id;

    let dishes;

    if(ingredients) {
        const filterIngredients = ingredients.split(',').map(ingredient => ingredient);
        
        dishes = await knex("ingredients")
            .select([
                "dishes.id",
                "dishes.name",
                //"dishes.user_id",
            ])
            //.where("dishes.user_id", user_id)
            .whereLike("name", `%${name}%`)
            .whereIn("ingredients.name", filterIngredients)
            .innerJoin("dishes", "dishes.id", "ingredients.dish_id")
            .groupBy("dishes.id")
            .orderBy("dishes.name")
    }else{
        dishes = await knex("dishes")
        //.where({ user_id })
        .whereLike("name", `%${name}%`)
        .orderBy( "name" );
    }

    const userIngredients = await knex("ingredients")//.where({ user_id });

    const dishesWithIngredients = dishes.map(dish => {
        const dishIngredients = userIngredients.filter(ingredient => ingredient.dish_id === dish.id);

        return {
            ...dish,
            dishes: dishIngredients
        }
    })

    return response.json(dishesWithIngredients);
}
}
  
module.exports = DishesController;