const express = require('express');
const routes = express.Router();
const adminController = require('../../controllers/v1/adminController');
const managerModel = require("../../models/v1/managerModel");
const passport = require("passport");

routes.post("/register", adminController.adminRegister);

routes.post("/login", adminController.adminLogin);

routes.post("/managerRegister", passport.authenticate("jwt", { failureRedirect: "/admin/verificationFailed" }), managerModel.uploadImage, adminController.managerRegister);

routes.delete("/deleteManager/:id", passport.authenticate("jwt", { failureRedirect: "/admin/verificationFailed" }), adminController.deleteManager);

routes.get("/viewManager", passport.authenticate("jwt", { failureRedirect: "/admin/verificationFailed" }), adminController.viewManager);


// verification Failed
routes.get("/verificationFailed", async (req, res) => {
    return res.status(400).json({ msg: "login required !", status: 0 });
})

module.exports = routes;