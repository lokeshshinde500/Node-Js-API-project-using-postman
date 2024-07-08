const express = require("express");
const employeeController = require("../../controllers/v1/employeeController");
const employeeModel = require("../../models/v1/employeeModel");
const routes = express.Router();
const passport = require("passport");


routes.post("/login", employeeController.login);

routes.get("/viewProfile", passport.authenticate("employeeJwt", { failureRedirect: "/employee/verificationFailed" }), employeeController.viewProfile);

routes.put("/update", passport.authenticate("employeeJwt", { failureRedirect: "/employee/verificationFailed" }), employeeModel.uploadImage, employeeController.employeeUpdate);

// verification Failed
routes.get("/verificationFailed", async (req, res) => {
    return res.status(400).json({ msg: "employee login required !", status: 0 });
})


module.exports = routes;