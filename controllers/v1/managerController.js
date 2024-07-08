const managerModel = require("../../models/v1/managerModel");
const employeeModel = require("../../models/v1/employeeModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const moment = require("moment");
const path = require("path");
const fs = require("fs");


module.exports.managerLogin = async (req, res) => {
    try {
        if (req.body) {
            const verifiedManager = await managerModel.findOne({ email: req.body.email });

            if (verifiedManager) {

                if (req.body.password == verifiedManager.password) {

                    const token = await jwt.sign({ verifiedManager }, "RNW", { expiresIn: "1h" });

                    return res.status(200).json({ msg: "manager login successfully :)", status: 1, token });

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
        console.log(error);
        return res.status(400).json({ msg: "server error !", status: 0 });
    }
}

module.exports.employeeRegister = async (req, res) => {
    try {

        if (req.file) {


            const isAlreadyEmail = await employeeModel.findOne({ email: req.body.email });

            if (!isAlreadyEmail) {
                req.body.image = employeeModel.employeeImagePath + "/" + req.file.filename;
                req.body.status = true;
                req.body.role = "employee"
                req.body.manager_id = req.user.id;
                req.body.created_date = moment().format('LLL');
                req.body.updated_date = moment().format('LLL');
                req.body.password = req.body.name + "@" + Math.round(Math.random() * 100000);

                await employeeModel.create(req.body);

                console.log("employee added");

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
                    html: `<p>employee email : ${req.body.email}</p><br/>
                           <p>employee password :  ${req.body.password}</p>`, // html body
                });

                return res.status(200).json({ msg: "employee registration & mail send successfully :)", status: 1 });

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

module.exports.deleteEmployee = async (req, res) => {


    try {
        if (req.params.id) {

            const employeeRecord = await employeeModel.findById(req.params.id);

            if (employeeRecord) {
                const imagePath = path.join(__dirname, "../../", employeeRecord.image);

                await fs.unlinkSync(imagePath);

                await employeeModel.findByIdAndDelete(req.params.id);

                return res.status(200).json({ msg: "employee record deleted :)", status: 1 });

            } else {
                return res.status(400).json({ msg: "employee not deleted !", status: 0 });

            }


        } else {
            return res.status(400).json({ msg: "employee not deleted !", status: 0 });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: " server error !", status: 0 });
    }
}

module.exports.viewProfile = async (req, res) => {
    try {
        if (req.user) {

            const profile = req.user;
            return res.status(200).json({ profile, status: 1 });

        } else {
            return res.status(400).json({ msg: "manager login required !", status: 1 });
        }
    } catch (error) {
        return res.status(400).json({ msg: "server error !", status: 1 });
    }

}

module.exports.viewEmployees = async (req, res) => {
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

        const employeesData = await employeeModel.find({
            $or: [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ]
        })
            .skip((perPage * page) - perPage)
            .limit(perPage)

        if (employeesData) {

            return res.status(200).json({ employeesData, status: 1 });

        } else {
            return res.status(400).json({ msg: "empty data !", status: 1 });
        }
    } catch (error) {
        return res.status(400).json({ msg: "server error !", status: 1 });
    }

}

module.exports.managerUpdate = async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.file);
        const editManager = await managerModel.findById(req.user.id);

        if (editManager) {

            if (req.file) {
                // if new image

                const deleteImage = path.join(__dirname, "../../", editManager.image);

                await fs.unlinkSync(deleteImage);

                req.body.image = managerModel.managerImagePath + "/" + req.file.filename;




            } else {

                req.body.image = editManager.image;

            }

            req.body.updated_date = moment().format("LLL");

            await managerModel.findByIdAndUpdate(req.user.id, req.body);

            return res.status(200).json({ msg: "manager updated successfully :)", status: 1 });

        } else {

            return res.status(400).json({ msg: "manager not updated", status: 0 });

        }



    } catch (error) {
        console.log(error)
        return res.status(400).json({ msg: "server error !", status: 0 });
    }
}


