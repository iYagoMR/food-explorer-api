const { Router } = require("express");

const multer = require("multer")
const uploadConfig = require("../configs/upload")

const AddressesController = require("../controllers/AddressesController");
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const verifyUserAuthorization = require("../middlewares/verifyUserAuthorization");

const addressesRoutes = Router();

const addressesController = new AddressesController();

addressesRoutes.use(ensureAuthenticated);

addressesRoutes.post("/",   addressesController.create);
addressesRoutes.get("/", addressesController.show);
addressesRoutes.put("/:id",   addressesController.update);

module.exports = addressesRoutes;