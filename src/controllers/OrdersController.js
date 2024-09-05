const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class DishesController {
    async create(request, response){
        const { total_price, payment_method, address } = request.body;
        let { order_items = []} = request.body;
        const user_id = request.user.id;

        const [order_id] = await knex("orders").insert({
            total_price,
            payment_method,
            user_id
        })

        if(order_items.length > 0){
            const orderItemsInsert = orderItems.map(item => {
                return{
                    name,
                    price,
                    quantity,
                    order_id,
                    dish_id,
                    user_id
                }
            });

            await knex("order_items").insert(orderItemsInsert);
        }

        if(address){
            const [address_id] = await knex("addresses").insert({
                address,
                payment_method,
                user_id
            })
        }

        return response.json();
    }

}
  
module.exports = DishesController;