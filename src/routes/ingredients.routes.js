const { Router } = require("express");

const IngredientsController = require("../controllers/DishesController.js")
const ensureAuthenticated = require("../middlewares/ensureAutheticathed");

const ingredientsRoutes = Router();

const tagsController = new IngredientsController();

ingredientsRoutes.get("/", ensureAuthenticated, tagsController.index);

module.exports = ingredientsRoutes;