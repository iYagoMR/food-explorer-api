const { Router } = require("express");

const UserFavoritesController = require("../controllers/UserFavoritesController");
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');

const userFavoritesRoutes = Router();

const userFavoritesController = new UserFavoritesController();

userFavoritesRoutes.use(ensureAuthenticated);

userFavoritesRoutes.get("/", userFavoritesController.index);
userFavoritesRoutes.get("/:id", userFavoritesController.show);
userFavoritesRoutes.post("/:id", userFavoritesController.create);
userFavoritesRoutes.delete("/:dish_id", userFavoritesController.delete);

module.exports = userFavoritesRoutes;