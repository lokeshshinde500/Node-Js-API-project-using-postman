
const adminModel = require("../../models/v1/adminModel");
const managerModel = require("../../models/v1/managerModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");


module.exports.adminRegister = async (req, res) => {
        try {
                if (req.body) {
                        const isAlreadyEmail = await adminModel.findOne({ email: req.body.email });
                        if (!isAlreadyEmail) {

                                if (req.body.password == req.body.confirmPassword) {

                                        req.body.password = await bcrypt.hash(req.body.password, 10);

                                        await adminModel.create(req.body);

                                        return res.status(200).json({ msg: "admin registered successfully :)", status: 1 });

                                } else {
                                        return res.status(400).json({ msg: "password and confirm password not match !!", status: 0 });

                                }


                        } else {

                                return res.status(400).json({ msg: "email already registered ! ", status: 0 });
                        }
                } else {
                        return res.status(400).json({ msg: "Enter registration data ", status: 0 });
                }
        } catch (error) {
                return res.status(400).json({ msg: "server error !", status: 0 });
        }
}

module.exports.adminLogin = async (req, res) => {
        try {
                if (req.body) {
                        const verifiedAdmin = await adminModel.findOne({ email: req.body.email });

                        if (verifiedAdmin) {

                                if (await bcrypt.compare(req.body.password, verifiedAdmin.password)) {

                                        const token = await jwt.sign({ verifiedAdmin }, "RNW", { expiresIn: "1h" });

                                        return res.status(200).json({ msg: "admin login successfully :)", status: 1, token });

                                } else {
                                        return res.status(400).json({ msg: "incorrect password !", status: 0 });

                                }



                        } else {

                                return res.status(400).json({ msg: "Enter registered email ! ", status: 0 });

                        }

                } else {
                        return res.status(400).json({ msg: "Enter login details", status: 0 });
                }
        } catch (error) {
                return res.status(400).json({ msg: "server error !", status: 0 });
        }
}

module.exports.managerRegister = async (req, res) => {
        try {

                if (req.file) {

                        const isAlreadyEmail = await managerModel.findOne({ email: req.body.email });

                        if (!isAlreadyEmail) {
                                req.body.image = managerModel.managerImagePath + "/" + req.file.filename;
                                req.body.status = true;
                                req.body.role = "manager"
                                req.body.admin_id = req.user.id;
                                req.body.created_date = moment().format('LLL');
                                req.body.updated_date = moment().format('LLL');
                                req.body.password = req.body.name + "@" + Math.round(Math.random() * 100000);

                                await managerModel.create(req.body);

                                console.log("manager added");

                                // nodemailer

                                const transporter = nodemailer.createTransport({
                                        host: "smtp.gmail.com",
                                        port: 587,
                                        secure: false,
                                        auth: {
                                                user: "lokeshinde500@gmail.com",
                                                pass: "kdcbqmlvrklolmlb",
                                        },
                                });

                                const info = await transporter.sendMail({
                                        from: '<lokeshinde500@gmail.com>', // sender address
                                        to: `${req.body.email}`, // list of receivers
                                        subject: "your login detail is here ✔", // Subject line
                                        text: "", // plain text body
                                        html: `<p>manager email : ${req.body.email}</p><br/>
                                               <p>manager password :  ${req.body.password}</p>`, // html body
                                });

                                return res.status(200).json({ msg: "manager registration & mail send successfully :)", status: 1 });

                        } else {
                                return res.status(400).json({ msg: "email already registered !", status: 0 });
                        }

                } else {

                        return res.status(400).json({ msg: "registration failed !", status: 0 });
                }

        } catch (error) {
                console.log(error);
                return res.status(400).json({ msg: "server error !", status: 0 });
        }
}

module.exports.deleteManager = async (req, res) => {
        try {
                if (req.params.id) {

                        const managerRecord = await managerModel.findById(req.params.id);

                        if (managerRecord) {
                                const imagePath = path.join(__dirname, "../../", managerRecord.image);

                                await fs.unlinkSync(imagePath);

                                await managerModel.findByIdAndDelete(req.params.id);

                                return res.status(200).json({ msg: "manager record deleted :)", status: 1 });

                        } else {
                                return res.status(400).json({ msg: "manager not deleted !", status: 0 });

                        }


                } else {
                        return res.status(400).json({ msg: "manager not deleted !", status: 0 });
                }
        } catch (error) {

                return res.status(400).json({ msg: " server error !", status: 0 });
        }
}

module.exports.viewManager = async (req, res) => {
        try {
                let search = "";
                let page = 1;
                let perPage = 2;

                if (req.query.page) {
                        page = req.query.page;
                }

                if (req.query.search) {
                        search = req.query.search;
                }

                const managerData = await managerModel.find({
                        $or: [
                                { name: { $regex: search, $options: "i" } },
                                { email: { $regex: search, $options: "i" } },
                        ]
                })
                        .skip((perPage * page) - perPage)
                        .limit(perPage)

                return res.status(200).json({ managerData, status: 1 });


        } catch (error) {
                return res.status(400).json({ msg: " server error !", status: 0 });
        }
}