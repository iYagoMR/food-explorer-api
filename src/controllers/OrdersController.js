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
            user_id,
            status: "Preparing"
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

    async update(request, response){
        const { status } = request.body;
        const { id } = request.params;

        await knex("orders")
            .where({ id })
            .update({
                status
            })

        return response.json();
    }

    async index(request, response) {
        const user_id = request.user.id;
        const user_role = request.user.role;
    
        // Initialize the query builder for fetching orders
        let ordersQuery = knex("order_items")
            .select([
                "orders.id",
                "orders.status",
                "orders.created_at",
                "orders.user_id"
            ])
            .innerJoin("orders", "orders.id", "order_items.order_id")
            .groupBy("orders.id")
            .orderBy("orders.created_at", "desc");
    
        // If the user is not an admin, add a WHERE clause to filter by the user's ID
        if (user_role !== 'admin') {
            ordersQuery = ordersQuery.where("orders.user_id", user_id);
        }
    
        // Execute the query to get the orders
        const orders = await ordersQuery;
    
        // Fetch order items for the current user if not an admin, or for all users if admin
        const userItemsQuery = user_role === 'admin'
            ? knex("order_items") // Fetch all order items if the user is an admin
            : knex("order_items").where("user_id", user_id); // Fetch only the current user's order items
    
        const userItems = await userItemsQuery;
    
        // Combine the orders with their corresponding items
        const ordersWithItems = orders.map(order => {
            const orderItems = userItems.filter(item => item.order_id === order.id);
    
            return {
                ...order,
                orders: orderItems
            };
        });
    
        return response.json(ordersWithItems);
    }

}
  
module.exports = OrdersController;