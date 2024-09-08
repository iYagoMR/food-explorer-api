const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class OrdersController {
    async create(request, response){
        const { total_price, payment_method, address_id } = request.body;
        let { order_items = []} = request.body;
        const user_id = request.user.id;

        const [order_id] = await knex("orders").insert({
            total_price,
            payment_method,
            address_id,
            user_id
        })

        if(order_items.length > 0){
            const orderItemsInsert = order_items.map(item => {
                return{
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    order_id,
                    dish_id: item.id,
                    user_id
                }
            });

            await knex("order_items").insert(orderItemsInsert);
        }

        return response.json();
    }

}
  
module.exports = OrdersController;