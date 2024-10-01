const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class OrdersController {
    async create(request, response, next) {
        const { total_price, payment_method, address_id, order_items = [] } = request.body;
        const user_id = request.user.id;

        const trx = await knex.transaction();  // Start a transaction
        try {
            // Validate price format
            const numericPrice = parseFloat(total_price);
            if (isNaN(numericPrice)) {
                throw new AppError("Invalid total price format", 400);
            }

            // Insert order details into the 'orders' table
            const [order_id] = await trx("orders")
                .insert({
                    total_price: numericPrice,
                    payment_method,
                    address_id,
                    user_id,
                    status: "Preparing"
                })
                .returning("id");  // Get the ID of the inserted order

            // Insert order items if any
            if (order_items.length > 0) {
                const orderItemsInsert = order_items.map(item => ({
                    name: item.name,
                    price: parseFloat(item.price),
                    quantity: item.quantity,
                    order_id,
                    dish_id: item.id,
                    user_id
                }));

                await trx("order_items").insert(orderItemsInsert);
            }

            await trx.commit();  // Commit the transaction
            return response.status(201).json({ message: "Order created successfully", order_id });
        } catch (error) {
            await trx.rollback();  // Rollback transaction on error
            next(new AppError("Error creating order", 500));
        }
    }

    async update(request, response, next) {
        const { status } = request.body;
        const { id } = request.params;

        try {
            const updated = await knex("orders")
                .where({ id })
                .update({ status, updated_at: knex.fn.now() });

            if (!updated) {
                throw new AppError("Order not found", 404);
            }

            return response.status(200).json({ message: "Order updated successfully" });
        } catch (error) {
            next(error);
        }
    }

    async index(request, response, next) {
        const user_id = request.user.id;
        const user_role = request.user.role;

        try {
            // Build the base query to fetch orders
            let ordersQuery = knex("orders")
                .select([
                    "orders.id",
                    "orders.status",
                    "orders.created_at",
                    "orders.user_id",
                    "orders.total_price"
                ])
                .orderBy("orders.created_at", "desc");

            // If the user is not an admin, filter orders by user ID
            if (user_role !== "admin") {
                ordersQuery = ordersQuery.where("orders.user_id", user_id);
            }

            const orders = await ordersQuery;

            // If no orders are found, return an appropriate message
            if (orders.length === 0) {
                throw new AppError("No orders found", 404);
            }

            // Fetch order items for each order
            const orderItems = await knex("order_items")
                .whereIn("order_id", orders.map(order => order.id));

            // Combine orders with their corresponding items
            const ordersWithItems = orders.map(order => ({
                ...order,
                items: orderItems.filter(item => item.order_id === order.id)
            }));

            return response.json(ordersWithItems);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = OrdersController;
