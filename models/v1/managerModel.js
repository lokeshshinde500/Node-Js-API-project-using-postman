const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const managerImagePath = "/uploads/managerImages";

const managerSchema = mongoose.Schema({
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
    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admin",
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


const managerImage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../", managerImagePath));
    },
    filename: (req, file, cb) => {

        cb(null, file.fieldname + "_" + Date.now());
    },
})

managerSchema.statics.uploadImage = multer({ storage: managerImage }).single("image");
managerSchema.statics.managerImagePath = managerImagePath;

const managerModel = mongoose.model("manager", managerSchema);

module.exports = managerModel;