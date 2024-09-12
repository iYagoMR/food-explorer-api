const { Router } = require("express");

const multer = require("multer")

const OrdersController = require("../controllers/OrdersController");
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const verifyUserAuthorization = require("../middlewares/verifyUserAuthorization");

const ordersRoutes = Router();

const ordersController = new OrdersController();

ordersRoutes.use(ensureAuthenticated);

ordersRoutes.post("/",   ordersController.create);
ordersRoutes.get("/", ordersController.index);
ordersRoutes.put("/:id", verifyUserAuthorization("admin"), ordersController.update);
// ordersRoutes.put("/:id",   ordersController.update);

module.exports = ordersRoutes;