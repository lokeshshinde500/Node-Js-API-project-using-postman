const employeeModel = require("../../models/v1/employeeModel")
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const moment = require("moment");


module.exports.login = async (req, res) => {
    try {
        if (req.body) {

            const verifiedEmployee = await employeeModel.findOne({ email: req.body.email });
            console.log(verifiedEmployee);
            if (verifiedEmployee) {
                if (req.body.password == verifiedEmployee.password) {

                    const token = await jwt.sign({ verifiedEmployee }, "RNW", { expiresIn: "1h" });

                    return res.status(200).json({ msg: "employee login successfully !", status: 1, token });

                } else {

                    return res.status(400).json({ msg: "incorrect password !", status: 0 })
                }

            } else {
                return res.status(400).json({ msg: "Enter registered email !", status: 0 })
            }

        } else {
            return res.status(400).json({ msg: "Enter login details !", status: 0 })
        }
    } catch (error) {
        return res.status(400).json({ msg: "server error !", status: 0 })
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

module.exports.employeeUpdate = async (req, res) => {
    try {
       
        const editEmployee = await employeeModel.findById(req.user.id);

        if (editEmployee) {

            if (req.file) {
                // if new image

                const deleteImage = path.join(__dirname, "../../", editEmployee.image);

                await fs.unlinkSync(deleteImage);

                req.body.image = employeeModel.employeeImagePath + "/" + req.file.filename;


            } else {

                req.body.image = editEmployee.image;

            }

            req.body.updated_date = moment().format("LLL");

            await employeeModel.findByIdAndUpdate(req.user.id, req.body);
            return res.status(200).json({ msg: "employee updated successfully :)", status: 1 });

        } else {

            return res.status(400).json({ msg: "employee not updated", status: 0 });

        }



    } catch (error) {
        console.log(error)
        return res.status(400).json({ msg: "server error !", status: 0 });
    }
}