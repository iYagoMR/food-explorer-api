const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class AddressesController {
    async create(request, response){
        const { address, city, state } = request.body;
        const user_id = request.user.id;

        const [newAddressId] = await knex("addresses").insert({
            address,
            city,
            state,
            user_id
        })

        const newAddress = await knex("addresses")
            .where({ id: newAddressId })
            .first();

        return response.json(newAddress);
    }

    async update(request, response){
        const { address, city, state, } = request.body;
        const user_id = request.user.id;
        const { id } = request.params;

        const addressObj = await knex("addresses").where({ id }).first();

        if(!addressObj){
            throw new AppError("Address not found");
        }

        // Update the address details in the database
        await knex("addresses")
            .where({ id })
            .update({
                address,
                city,
                state,
                user_id
        });

        return response.json();
    }

    async show(request, response) {
        const user_id = request.user.id;

        const address = await knex("addresses").where("user_id", user_id).first();

        return response.json(address);
    }

    async delete(request, response) {
        const { id } = request.params;
        
        await knex("addresses").where({ id }).delete();

        return response.json();
    }

    async index(request, response) {
        const { address } = request.query;

        const user_id = request.user.id;

        const addresses = await knex("addresses")
            .whereLike("address", `%${address}%`)
            .where("user_id", user_id)
            .orderBy( "address" );

        return response.json(addresses);
    }

}


  
module.exports = AddressesController;