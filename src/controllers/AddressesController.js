const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class AddressesController {
    async create(request, response, next) {
        try {
            const { address, city, state } = request.body;
            const user_id = request.user.id;

            // Insert and return the new address
            const [newAddressId] = await knex("addresses")
                .insert({ address, city, state, user_id })
                .returning("id");

            const newAddress = await knex("addresses")
                .where({ id: newAddressId })
                .first();

            return response.status(201).json(newAddress);
        } catch (error) {
            next(new AppError("Error creating address", 500));
        }
    }

    async update(request, response, next) {
        try {
            const { address, city, state } = request.body;
            const user_id = request.user.id;
            const { id } = request.params;

            const addressObj = await knex("addresses").where({ id }).first();

            if (!addressObj) {
                throw new AppError("Address not found", 404);
            }

            // Update address and return the updated object
            await knex("addresses")
                .where({ id })
                .update({ address, city, state, user_id, updated_at: knex.fn.now() });

            const updatedAddress = await knex("addresses").where({ id }).first();

            return response.json(updatedAddress);
        } catch (error) {
            next(new AppError("Error updating address", 500));
        }
    }

    async show(request, response, next) {
        try {
            const user_id = request.user.id;

            const address = await knex("addresses")
                .where("user_id", user_id)
                .first();

            if (!address) {
                throw new AppError("Address not found", 404);
            }

            return response.json(address);
        } catch (error) {
            next(new AppError("Error retrieving address", 500));
        }
    }

    async delete(request, response, next) {
        try {
            const { id } = request.params;

            const deletedRows = await knex("addresses").where({ id }).delete();

            if (!deletedRows) {
                throw new AppError("Address not found", 404);
            }

            return response.status(204).send();
        } catch (error) {
            next(new AppError("Error deleting address", 500));
        }
    }

    async index(request, response, next) {
        try {
            const { address } = request.query;
            const user_id = request.user.id;

            const addresses = await knex("addresses")
                .where("user_id", user_id)
                .andWhere("address", "ILIKE", `%${address}%`)
                .orderBy("address");

            return response.json(addresses);
        } catch (error) {
            next(new AppError("Error retrieving addresses", 500));
        }
    }
}

module.exports = AddressesController;
