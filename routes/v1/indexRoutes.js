const express = require('express');
const routes = express.Router();

routes.use("/admin", require("./adminRoutes"));
routes.use("/manager", require("./managerRoutes"));
routes.use("/employee", require("./employeeRoutes"));

module.exports = routes;

