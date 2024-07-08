const express = require("express");
const routes = express.Router();
const managerController = require("../../controllers/v1/managerController");
const employeeModel = require("../../models/v1/employeeModel");
const passport = require("passport");
const managerModel = require("../../models/v1/managerModel");

routes.post("/login", managerController.managerLogin);

routes.put("/update", passport.authenticate("managerJwt", { failureRedirect: "/manager/verificationFailed" }), managerModel.uploadImage, managerController.managerUpdate);

routes.post("/employeeRegister", passport.authenticate("managerJwt", { failureRedirect: "/manager/verificationFailed" }), employeeModel.uploadImage, managerController.employeeRegister);

routes.delete("/deleteEmployee/:id", passport.authenticate("managerJwt", { failureRedirect: "/manager/verificationFailed" }), managerController.deleteEmployee)

routes.get("/viewProfile", passport.authenticate("managerJwt", { failureRedirect: "/manager/verificationFailed" }), managerController.viewProfile)

routes.get("/viewEmployees", passport.authenticate("managerJwt", { failureRedirect: "/manager/verificationFailed" }), managerController.viewEmployees)
routes.get("/verificationFailed", async (req, res) => {
    return res.status(400).json({ msg: "manager login required !", status: 0 });
})

module.exports = routes;