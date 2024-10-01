const knex = require("../database/knex");
const { hash } = require("bcryptjs");
const AppError = require("../utils/AppError");

class UsersController {
  async create(request, response, next) {
    const { name, email, password } = request.body;

    try {
      // Check if the user already exists
      const existingUser = await knex("users").where({ email }).first();

      if (existingUser) {
        throw new AppError("Este e-mail já está em uso.", 400); // Return 400 for bad request
      }

      // Hash the password before storing it
      const hashedPassword = await hash(password, 8);

      // Insert the new user into the database
      await knex("users").insert({ name, email, password: hashedPassword });

      return response.status(201).json({ message: "User created successfully." });
    } catch (error) {
      next(error); // Pass the error to the global error handler
    }
  }
}

module.exports = UsersController;
