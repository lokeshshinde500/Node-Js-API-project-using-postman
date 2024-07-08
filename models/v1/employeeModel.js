const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const employeeImagePath = "/uploads/employeeImages";

const employeeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    manager_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "manager",
        required: true
    },
    created_date: {
        type: String,
        required: true
    },
    updated_date: {
        type: String,
        required: true
    },
})


const employeeImage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../", employeeImagePath));
    },
    filename: (req, file, cb) => {

        cb(null, file.fieldname + "_" + Date.now());
    },
})

employeeSchema.statics.uploadImage = multer({ storage: employeeImage }).single("image");
employeeSchema.statics.employeeImagePath = employeeImagePath;

const employeeModel = mongoose.model("employee", employeeSchema);

module.exports = employeeModel;