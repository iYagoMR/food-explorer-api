const { Router } = require("express");

const usersRouter = require("./users.routes");
const sessionsRouter = require("./sessions.routes");
const userFavoritesRouter = require("./userFavorites.routes");
const dishesRouter = require("./dishes.routes");
const addressesRouter = require("./address.routes");
const ordersRouter = require("./orders.routes");

const routes = Router();

routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRouter);
routes.use("/userFavorites", userFavoritesRouter);
routes.use("/orders", ordersRouter);
routes.use("/addresses", addressesRouter);
routes.use("/dishes", dishesRouter);

module.exports = routes;