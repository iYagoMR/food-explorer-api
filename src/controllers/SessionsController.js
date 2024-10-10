const { compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const knex = require("../database/knex");
const authConfig = require("../configs/auth");
const AppError = require("../utils/AppError");

class SessionsController {
  async create(request, response, next) {
    const { email, password } = request.body;

    try {
      // Check if the user exists
      const user = await knex("users").where({ email }).first();

      if (!user) {
        throw new AppError("E-mail or password is incorrect.", 401);
      }

      // Compare the provided password with the hashed password stored in the database
      const passwordMatched = await compare(password, user.password);
      
      if (!passwordMatched) {
        throw new AppError("E-mail or password is incorrect.", 401);
      }

      // JWT configuration from the auth config
      const { secret, expiresIn } = authConfig.jwt;

      // Generate a token with the user's role and ID
      const token = sign({ role: user.role }, secret, {
        subject: String(user.id),
        expiresIn,
      });

      // Send the token and user data in the response
      return response.status(201).json({ token, user });
    } catch (error) {
      next(error); // Pass the error to the global error handler
    }
  }
}

module.exports = SessionsController;
